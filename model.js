const {
    client,
    setMongoObjectId,
    // startMongoSession,
} = require('./database/mongoDb/setup.js');

const {
    readOperation,
    updateFirstMatchingRecordOperation,
    writeOperation,
    aggregateOperation,
} = require('./database/mongoDb/queries');

/**
 * Function to read from wallet db layer
 * @param { Object } options - reqd - query, optional - limit, offset, sort
 * @returns {Promise} promise object
 */
const _readFromWalletDb = async (options) => readOperation(
    { client, },
    { db: 'wallet', ...options, }
);

/**
 * Function to get records by aggregation
 * @param { Object } options - reqd - query
 * @returns {Promise} promise object
 */
const _aggregateFromWalletDb = async (options) => aggregateOperation(
    { client, },
    { db: 'wallet', ...options, }
);


/**
 * Function to update first matching record if found in wallet database layer
 * @param { Object } options - reqd - query
 * @returns {Promise} promise object
 */
const _updateFirstMatchingRecordInWalletDb = async (options) => updateFirstMatchingRecordOperation(
    { client, },
    { db: 'wallet', ...options, }
);

/**
 * Function to write to wallet database layer
 * @param { Object } options - reqd - query
 * @returns {Promise} promise object
 */
const _writeToWalletDb = async (options) => writeOperation(
    { client, },
    { db: 'wallet', ...options, }
);

const _createUser = async (data, dependencies = {}) => {
    const query = {
        ...data,
    };
    // const {
    //     session,
    // } = dependencies;

    const queryOptions = {
        query,
        collection: 'user',
        // session,
    };

    return _writeToWalletDb(queryOptions);
};

const _createWallet = async (data, dependencies = {}) => {
    const query = {
        ...data,
    };
    // const {
    //     session,
    // } = dependencies;

    const queryOptions = {
        query,
        collection: 'wallet',
        // session,
    };

    return _writeToWalletDb(queryOptions);
};

const setupWallet = async (data) => {
    const {
        name,
        balance,
    } = data;
    const date = new Date();

    const result = {
        success: 1,
        data: {},
        message: 'success',
    };
    // const session = await startMongoSession();
    try {
        // await session.startTransaction();
        const responseUser = await _createUser({
            name,
            date,
        });
        if (responseUser.success === 0 || responseUser.insertedCount === 0) throw new Error('Something went wrong in responseUser, please try again');

        const responseWallet = await _createWallet({
            balance: parseFloat(parseFloat(balance).toFixed(4)),
            user_id: responseUser.ops[0]._id,
            date,
        });
        if (responseWallet.success === 0 || responseWallet.insertedCount === 0) throw new Error('Something went wrong in responseWallet, please try again');

        result.data = {
            id: responseWallet.insertedId,
            balance: responseWallet.ops[0].balance,
            name: responseUser.ops[0].name,
            date: responseWallet.ops[0].date,
        }
    } catch (error) {
        // await session.abortTransaction();
        console.error('Something went wrong in setupWallet', error);

        result.success = 0;
        result.message = error.message;
    }
    // finally {
    //     // await session.endSession();
    //     console.info('Session end and connection closed successfully for setupWallet!');
    // }

    return result;
};

const getWalletDetails = async (data) => {
    const {
        id,
        // session,
    } = data;

    const query = [
        {
            $match: {
                _id: setMongoObjectId(id),
            },
        },
        {
            $lookup: {
                from: 'user',
                localField: 'user_id',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        {
            $unwind: '$userDetails'
        },
    ];

    const queryOptions = {
        query,
        collection: 'wallet',
    };

    return _aggregateFromWalletDb(queryOptions);
};

const _writeTransaction = async (data) => {
    const {
        walletId,
        amount,
        balance,
        description,
        type,
        date,
        // session,
    } = data;

    const query = {
        walletId,
        amount,
        balance,
        description,
        type,
        date,
    };

    const queryOptions = {
        query,
        // session,
        collection: 'transaction',
    };

    return _writeToWalletDb(queryOptions);
};

const _updateWalletBalance = (data) => {
    const {
        filterValuesForUpdate,
        valuesToUpdate,
        // session,
    } = data;

    if (filterValuesForUpdate._id) {
        filterValuesForUpdate._id = setMongoObjectId(filterValuesForUpdate._id);
    }

    const updateValues = {
        $set: valuesToUpdate,
    };

    return _updateFirstMatchingRecordInWalletDb({
        query: filterValuesForUpdate,
        updateValues,
        // session,
        collection: 'wallet',
    });
}
const _checkForBalanceSanity = (type, amount, balance) => {
    if (type.toLowerCase() === 'debit') {
        return balance >= amount;
    }
    // credit
    return true;
};
const _getUpdatedBalance = (type, amount, balance) => {
    if (type.toLowerCase() === 'debit') {
        return parseFloat(parseFloat(balance - amount).toFixed(4));
    }
    // credit
    return parseFloat(parseFloat(balance + amount).toFixed(4));
}

const performTransaction = async (data) => {
    const date = new Date();
    const {
        walletId,
        amount,
        description,
        type,
    } = data;
    const result = {
        success: 1,
        data: {},
        message: 'success',
    };
    // const session = await startMongoSession();
    try {
        // await session.startTransaction();

        const responseWalletDetails = await getWalletDetails({
            id: walletId,
            // session
        });
        if (responseWalletDetails.success === 0) throw new Error('Something went wrong');
        if (responseWalletDetails.data.length === 0) throw new Error('wallet id not present');

        const { balance, } = responseWalletDetails.data[0];

        if (!_checkForBalanceSanity(type, parseFloat(parseFloat(amount).toFixed(4)), parseFloat(parseFloat(balance).toFixed(4)))) throw new Error('existing balance is less than amount');
        const updatedBalance = _getUpdatedBalance(type, parseFloat(parseFloat(amount).toFixed(4)), parseFloat(parseFloat(balance).toFixed(4)));
        console.log('$$$$', updatedBalance);
        const responseOfTransaction = await _writeTransaction({
            walletId: setMongoObjectId(walletId),
            amount: parseFloat(parseFloat(amount).toFixed(4)),
            balance: updatedBalance,
            description,
            type,
            date,
            // session,
        });
        console.log('$$$$$', responseOfTransaction);
        if (responseOfTransaction.success === 0 || responseOfTransaction.insertedCount === 0) throw new Error('Something went wrong in responseOfTransaction');

        const responseOfUpdateWalletBalance = await _updateWalletBalance({
            filterValuesForUpdate: {
                _id: walletId,
            },
            valuesToUpdate: {
                balance: updatedBalance,
                updatedDate: date,
            },
            // session,
        });
        if (responseOfUpdateWalletBalance.success === 0
            || responseOfUpdateWalletBalance.lastErrorObject.updatedExisting === false) throw new Error('Something went wrong');

        // await session.commitTransaction();

        result.data = {
            balance: updatedBalance,
            transactionId: responseOfTransaction.insertedId,
            date,
        };
    } catch (error) {
        // await session.abortTransaction();
        console.error('Something went wrong in performTransaction', error);

        result.success = 0;
        result.message = error.message;
    }
    // finally {
    //     // await session.endSession();
    //     console.info('Session end and connection closed successfully for performTransaction!');
    // }

    return result;
};

const fetchTransactions = async (data) => {
    const {
        walletId,
        skip,
        limit,
    } = data;

    const queryOptions = {
        query: {
            walletId: setMongoObjectId(walletId),
        },
        collection: 'transaction',
        limit: parseInt(limit, 10),
        offset: parseInt(skip, 10),
        sort: {
            date: -1, // get trx that was created recently.
        },
        project: {
            _id: 0,
            id: "$_id",
            walletId: 1,
            amount: 1,
            balance: 1,
            description: 1,
            type: 1,
            date: 1
        },
    };

    return _readFromWalletDb(queryOptions);
};

module.exports = {
    setupWallet,
    performTransaction,
    fetchTransactions,
    getWalletDetails,
};
