const { MongoClient, ObjectID, } = require('mongodb');
const assert = require('assert');
const config = require('../../config');
const { isEmptyOrNil, } = require('../../utilities');

// Connection URLs
const mongoUrl = config.mongoDB;

/**
 * Function to create connection to read active records from Mongo
 * @param {String} mongo URI
 * @param {Object} mongo options
 * @returns {Object} result
 */
const client = new MongoClient(mongoUrl,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });

// Use connect method to connect to the Server
client.connect((err) => {
    assert.equal(null, err);
});

/**
 * Function to set mongo objectId
 * @param { String } value string
 * @returns {Object} object
 */
const setMongoObjectId = ((value) => new ObjectID(value));


/**
 * Function to start mongo session
 * @param { Object } transactionOptions transaction properties
 * @returns {Promise} object
 */
const startMongoSession = async (transactionOptions) => {
    try {
        if (!isEmptyOrNil(transactionOptions)) {
            return client.startSession(transactionOptions);
        }

        return client.startSession({
            readPreference: 'primary',
            readConcern: { level: 'local', },
            writeConcern: { w: 'majority', },
        });
    } catch (error) {
        const errorMessage = `Something went wrong in startMongoSession, ${error}`;
        logger.error(errorMessage);
        throw new Error(errorMessage);
    }
};

module.exports = {
    client,
    setMongoObjectId,
    startMongoSession,
};
