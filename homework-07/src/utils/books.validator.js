/**
 * @param {Object} data
 * @throws {ValidationError}
 */
export const validateCreateData = (data) => {
    const errors = []
    const {id, title, author, price, year, genres, ...rest} = data;

    if (data.hasOwnProperty('id')) {
        errors.push('Property "id" cannot be set');
    }

    // required properties
    if (!title) {
        errors.push('Missing required property "title"');
    }

    if (!author) {
        errors.push('Missing required property "author"');
    }

    if (!price) {
        errors.push('Missing required property "price"');
    }

    // properties types
    if (title && typeof title !== 'string') {
        errors.push('Property "title" should be a string');
    }

    if (author && typeof author !== 'string') {
        errors.push('Property "author" should be a string');
    }

    if (price && (typeof price !== 'number' || price < 1)) {
        errors.push('Property "price" should be a number not less than 1');
    }

    if (year !== undefined && (typeof year !== 'number' || year < 1900 || year > 2100)) {
        errors.push('Property "year" should be a number within 1900 and 2100 included');
    }

    if (genres !== undefined && (!Array.isArray(genres) || genres.some(genre => typeof genre !== 'string'))) {
        errors.push('Property "genres" should be an array of strings');
    }

    // extra properties are not allowed
    const keys = Object.keys(rest);
    if (keys.length) {
        errors.push(`Redundant data provided "${keys.join('", "')}"`);
    }

    if (errors.length) {
        throw new ValidationError(errors);
    }
}

/**
 * @param {Object} data
 * @throws {ValidationError}
 */
export const validateUpdateData = (data) => {
    const errors = [];
    const {id, title, author, price, year, genres, ...rest} = data;

    if (data.hasOwnProperty('id')) {
        errors.push('Property "id" cannot be set');
    }

    if (!title && !author && !price && (!year && year !== null) && (!genres && genres !== null)) {
        errors.push('No data provided for a book update');
    }

    // properties types
    if (title && typeof title !== 'string') {
        errors.push('Property "title" should be a string');
    }

    if (author && typeof author !== 'string') {
        errors.push('Property "author" should be a string');
    }

    if (price && (typeof price !== 'number' || price < 1)) {
        errors.push('Property "price" should be a number not less than 1');
    }

    if (year !== null && year && (typeof year !== 'number' || year < 1900 || year > 2100)) {
        errors.push('Property "year" should be a number within 1900 and 2100 included');
    }

    if (genres !== null && genres && (!Array.isArray(genres) || genres.some(genre => typeof genre !== 'string'))) {
        errors.push('Property "genres" should be an array of strings');
    }

    const keys = Object.keys(rest);
    if (keys.length) {
        errors.push(`Redundant data provided "${keys.join('", "')}"`);
    }

    if (errors.length) {
        throw new ValidationError(errors);
    }
}

export class ValidationError extends Error {
    /**
     * @param {string[]} errors
     */
    constructor(errors) {
        super('Validation Error');
        this.errors = errors;
    }

    getErrors() {
        return this.errors;
    }
}
