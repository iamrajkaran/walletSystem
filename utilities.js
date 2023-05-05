const {
    isEmpty,
    isNil,
    converge,
    or,
} = require('ramda');

const isEmptyOrNil = converge(or, [isEmpty, isNil]);

module.exports = {
    isEmptyOrNil,
};
