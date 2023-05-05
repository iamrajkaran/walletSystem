const { isEmptyOrNil, } = require('../../utilities');

module.exports = {
    /**
     * Function to read records of collection from database
     * @param {Object} dependencies - required dependencies for creating connection and logging
     * @param {Object} dependencies.client - required, mongo client to connect
     * @param {Object} data - db, collection, query, offset, limit, sort
     * @param {String} data.db - required
     * @param {String} data.collection - required
     * @param {String} data.query - required
     * @param {String} data.offset - optional
     * @param {String} data.limit - optional
     * @param {String} data.sort - optional
     * @returns {Promise} result
     */
    readOperation: ({ client, }, data) => {
        try {
            const {
                db,
                collection,
                query,
                offset = 0,
                limit = 0, // default: no limit on fetching data
                sort = {},
                project = {},
            } = data;

            console.log('readOperation from db => ', db, ' using query => ', query, ' offset => ', offset, ' limit => ', limit);

            return new Promise((resolve, reject) => {
                client.db(db)
                    .collection(collection)
                    .find(query)
                    .project(project)
                    .sort(sort)
                    .skip(offset)
                    .limit(limit)
                    .toArray((err, response) => {
                        if (err) {
                            reject(err);
                        }

                        resolve({ success: 1, data: response, });
                    });
            });
        } catch (err) {
            console.error('readOperation | error =>  ', err);

            throw err;
        }
    },
    /**
     * Function to update first matching document in collections of database
     * @param {Object} dependencies - required dependencies for creating connection and logging
     * @param {Object} dependencies.client - required, mongo client to connect
     * @param {Object} data - db, collection, query
     * @param {String} data.db - required
     * @param {String} data.collection - required
     * @param {String} data.query - required
     * @param {Object} data.session - optional
     * @param {String} data.updateValues - required
     * @returns {Promise} result
     */
    updateFirstMatchingRecordOperation: async ({ client, }, data) => {
        try {
            const {
                db,
                collection,
                query,
                updateValues,
                session = {},
            } = data;

            if (isEmptyOrNil(session)) {
                return client.db(db)
                    .collection(collection).findOneAndUpdate(
                        query, updateValues
                    );
            }

            const options = {
                session,
            };

            return client.db(db)
                .collection(collection).findOneAndUpdate(
                    query, updateValues,
                    options,
                );
        } catch (err) {
            console.error('updateFirstMatchingRecordOperation | error =>  ', err);

            throw err;
        }
    },
    /**
     * Function to write
     * @param {Object} dependencies - required dependencies for creating connection and logging
     * @param {Object} dependencies.client - required, mongo client to connect
     * @param {Object} data - db, collection, query
     * @param {String} data.db - required
     * @param {String} data.collection - required
     * @param {String} data.query - required
     * @param {Object} data.session - optional
     * @returns {Promise} result
     */
    writeOperation: async ({ client, }, data) => {
        try {
            const {
                db, collection, query, session = {},
            } = data;

            if (!isEmptyOrNil(session)) {
                return client.db(db)
                    .collection(collection).insertOne(query, { session, });
            }

            return client.db(db)
                .collection(collection).insertOne(query);
        } catch (err) {
            console.error('writeOperation | error =>  ', err);

            throw err;
        }
    },

    /**
     * Function to get aggregate records of collection from database
     * @param {Object} dependencies - required dependencies for creating connection and logging
     * @param {Object} dependencies.client - required, mongo client to connect
     * @param {Object} data - db, collection, query
     * @param {String} data.db - required
     * @param {String} data.collection - required
     * @param {String} data.query - required
     * @returns {Promise} result
     */
    aggregateOperation: ({ client, }, data) => {
        try {
            const {
                db, collection, query,
            } = data;

            console.log('aggregate from db => ', db, ' using query => ', query);

            return new Promise((resolve, reject) => {
                client.db(db)
                    .collection(collection)
                    .aggregate(query)
                    .toArray((err, response) => {
                        if (err) {
                            reject(err);
                        }

                        resolve({ success: 1, data: response, });
                    });
            });
        } catch (err) {
            console.error('aggregate | error =>  ', err);

            throw err;
        }
    },
};
