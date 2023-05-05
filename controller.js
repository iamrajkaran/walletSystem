const Joi = require('joi');
const {
    setupWallet: setupWalletService,
    performTransaction: performTransactionService,
    fetchTransactions: fetchTransactionsService,
    getWalletDetails: getWalletDetailsService,
} = require('./service');

const setupWallet = async (req, res) => {
    const schema = Joi.object().keys({
        body: {
            balance: Joi.number().integer().positive().required(),
            name: Joi.string().min(3).max(50).required(),
        },
    }).options({ allowUnknown: true, });

    const request = { ...req.body, };

    console.log(' setupWallet controller | request =>', request);

    Joi.validate(request, schema, async (err) => {
        if (err) {
            console.error('setupWallet controller s | JOI validation error => ', err);

            res.status(400).json({
                status: 'error',
                success: 0,
                message: err.details[0].message,
            });
        } else {
            const result = await setupWalletService(request);

            if (result.success === 1) {
                console.info('SetupWallet controller | setupWalletService | response from service => ', result);

                res.send({ success: 1, status: result.status || 200, message: result.message || 'success', data: result.data, });
            } else {
                let message = 'Some error occurred. Please try again after some time.';

                if (Object.prototype.hasOwnProperty.call(result, 'message')) {
                    message = result.message;
                }

                console.error('SetupWallet controller | setupWalletService | response from service => ', message);

                res.send({ success: 0, status: 500, message, data: {}, });
            }
        }
    });
}

const performTransaction = async (req, res) => {
    const schema = Joi.object().keys({
        body: {
            type: Joi.number().valid(['Debit', 'Credit']).required(),
            amount: Joi.number().integer().positive().required(),
            description: Joi.string().min(3).max(50).required(),
        },
        params: {
            walletId: Joi.string().required(),
        }
    }).options({ allowUnknown: true, });

    const request = {
        ...req.body,
        ...req.params,
    };

    console.log('performTransaction controller | request =>', request);

    Joi.validate(request, schema, async (err) => {
        if (err) {
            console.error('performTransaction controller s | JOI validation error => ', err);

            res.status(400).json({
                status: 'error',
                success: 0,
                message: err.details[0].message,
            });
        } else {
            const result = await performTransactionService(request);

            if (result.success === 1) {
                console.info('performTransaction controller | performTransactionService | response from service => ', result);

                res.send({ success: 1, status: result.status || 200, message: result.message || 'success', data: result.data, });
            } else {
                let message = 'Some error occurred. Please try again after some time.';

                if (Object.prototype.hasOwnProperty.call(result, 'message')) {
                    message = result.message;
                }

                console.error('performTransaction controller | performTransactionService | response from service => ', message);

                res.send({ success: 0, status: 500, message, });
            }
        }
    });
}

const fetchTransactions = async (req, res) => {
    const schema = Joi.object().keys({
        query: {
            walletId: Joi.string().required(),
            skip: Joi.string().required(),
            limit: Joi.string().required(),
        },
    }).options({ allowUnknown: true, });

    const request = { ...req.query, };

    console.log('fetchTransactions controller | request =>', request);

    Joi.validate(request, schema, async (err) => {
        if (err) {
            console.error('fetchTransactions controller s | JOI validation error => ', err);

            res.status(400).json({
                status: 'error',
                success: 0,
                message: err.details[0].message,
            });
        } else {
            const result = await fetchTransactionsService(request);

            if (result.success === 1) {
                console.info('fetchTransactions controller | fetchTransactionsService | response from service => ', result);

                res.send({ success: 1, status: result.status || 200, message: result.message || 'success', data: result.data, });
            } else {
                let message = 'Some error occurred. Please try again after some time.';

                if (Object.prototype.hasOwnProperty.call(result, 'message')) {
                    message = result.message;
                }

                console.error('fetchTransactions controller | fetchTransactionsService | response from service => ', message);

                res.send({ success: 0, status: 500, message, });
            }
        }
    });
}

const getWalletDetails = async (req, res) => {
    const schema = Joi.object().keys({
        params: {
            id: Joi.string().required(),
        },
    }).options({ allowUnknown: true, });

    const request = {
        ...req.query,
        ...req.params,
    };

    console.log('getWalletDetails controller | request =>', request);

    Joi.validate(request, schema, async (err) => {
        if (err) {
            console.error('getWalletDetails controller s | JOI validation error => ', err);

            res.status(400).json({
                status: 'error',
                success: 0,
                message: err.details[0].message,
            });
        } else {
            const result = await getWalletDetailsService(request);

            if (result.success === 1) {
                console.info('getWalletDetails controller | getWalletDetailsService | response from service => ', result);

                res.send({ success: 1, status: result.status || 200, message: result.message || 'success', data: result.data, });
            } else {
                let message = 'Some error occurred. Please try again after some time.';

                if (Object.prototype.hasOwnProperty.call(result, 'message')) {
                    message = result.message;
                }

                console.error('getWalletDetails controller | getWalletDetailsService | response from service => ', message);

                res.send({ success: 0, status: 500, message, });
            }
        }
    });
}

module.exports = {
    setupWallet,
    performTransaction,
    fetchTransactions,
    getWalletDetails,
};