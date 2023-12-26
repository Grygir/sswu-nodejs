export default sub;

/**
 * Performs arithmetic operation of subtraction
 *
 * @param {...number} params
 * @returns {number}
 */
function sub(...params) {
    if (params.length < 2) {
        throw new Error('Subtraction operation requires at least two arguments');
    }
    if (params.some(param => isNaN(param) || typeof param === 'string' || param === null)) {
        throw new Error('All arguments for subtraction operation have to be numbers');
    }

    return params.slice(1)
        .reduce((res, param) => res - param, params[0]);
}
