export default add;

/**
 * Performs arithmetic operation of addition
 *
 * @param {...number} params
 * @returns {number}
 */
function add(...params) {
    if (params.length < 2) {
        throw new Error('Addition operation requires at least two arguments');
    }
    if (params.some(param => isNaN(param) || typeof param === 'string' || param === null)) {
        throw new Error('All arguments for addition operation have to be numbers');
    }

    return params.slice(1)
        .reduce((res, param) => res + param, params[0]);
}
