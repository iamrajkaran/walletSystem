const {
    setupWallet: setupWalletModel,
    performTransaction: performTransactionModel,
    fetchTransactions: fetchTransactionsModel,
    getWalletDetails: getWalletDetailsModel,
} = require('./model');

const handleErrorMessage = (err) => {

    if (err.message === 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters') {
        return { success: 1, data: {}, status: 200, message: 'wallet id not exist'};
    }

    if (err.message === 'existing balance is less than amount') {
        return { success: 1, data: {}, status: 200, message: 'existing balance is less than amount'};
    }

    console.error(err);

    return { success: 0, data: {}, message: 'failed'};
}

const setupWallet = async (data) => {
    try {
        const response = await setupWalletModel(data);
        if (response.success === 0) throw new Error('Something went wrong, please try again');

        return {
            success: response.success,
            data: response.data,
            status: 201,
            message: 'success'
        };

    } catch (err) {
        console.error(err);

        return { success: 0, data: {}, message: 'failed'};
    }
};

const performTransaction = async (data) => {
    try {
        const response = await performTransactionModel(data);
        if (response.success === 0) throw new Error(response.message || 'Something went wrong, please try again');

        return {
            success: 1,
            data: {
                ...response.data,
            },
            status: 201,
            message: 'success'
        };

    } catch (err) {
        return handleErrorMessage(err);
    }
};

const fetchTransactions = async (data) => {
    try {
        const response = await fetchTransactionsModel(data);
        if (response.success === 0) throw new Error('Something went wrong, please try again');
        if (response.data.length === 0) return { success: 1, data: {}, message: 'no transaction exist'};

        return {
            success: 1,
            data: response.data,
            status: 200,
            message: 'success'
        };

    } catch (err) {
        return handleErrorMessage(err);
    }
};

const getWalletDetails = async (data) => {
    try {
        const response = await getWalletDetailsModel(data);
        if (response.success === 0) throw new Error('Something went wrong, please try again');
        if (response.data.length === 0) return { success: 1, data: {}, message: 'no wallet exist'};

        const {
            _id: id,
            balance,
            userDetails,
            date,
        } = response.data[0];

        return {
            success: 1,
            data: {
                id,
                balance,
                name: userDetails.name,
                date,
            },
            status: 200,
            message: 'success'
        };
    } catch (err) {
        return handleErrorMessage(err);
    }
};

module.exports = {
    setupWallet,
    performTransaction,
    fetchTransactions,
    getWalletDetails,
};
