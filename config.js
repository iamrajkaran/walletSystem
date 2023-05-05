module.exports = (function() {
    return {
        port: 7007,
        mongoDB: process.env.MONGO_DB,
        UI_APP: process.env.UI_APP
    }
}());
