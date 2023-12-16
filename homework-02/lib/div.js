export default div;

/**
 * Performs arithmetic operation of division
 *
 * @param {...number} params
 * @returns {number}
 */
function div(...params) {
    if (params.length < 2) {
        throw new Error('Division operation requires at least two arguments');
    }
    if (params.some(param => isNaN(param) || typeof param === 'string' || param === null)) {
        throw new Error('All arguments for division operation have to be numbers');
    }
    if (params.slice(1).some(param => param === 0)) {
        throw new Error('Divisor can not be zero');
    }

    return params.slice(1)
        .reduce((res, param) => res / param, params[0]);
}
