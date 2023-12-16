export default mul;

/**
 * Performs arithmetic operation of multiplication
 *
 * @param {...number} params
 * @returns {number}
 */
function mul(...params) {
    if (params.length < 2) {
        throw new Error('Multiplication operation requires at least two arguments');
    }
    if (params.some(param => isNaN(param) || typeof param === 'string' || param === null)) {
        throw new Error('All arguments for multiplication operation have to be numbers');
    }

    return params.slice(1)
        .reduce((res, param) => res * param, params[0]);
}
