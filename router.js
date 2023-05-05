module.exports = {
    createRouter(app) {
        const {
            setupWallet,
            performTransaction,
            fetchTransactions,
            getWalletDetails,
        } = require('./controller');

        app.get('/', (req, res) => {
            res.send('Route not defined. Please choose another route');
        });

        app.post('/setup', setupWallet);

        app.post('/transact/:walletId', performTransaction);

        app.get('/transactions', fetchTransactions);

        app.get('/wallet/:id', getWalletDetails);
    }
};
