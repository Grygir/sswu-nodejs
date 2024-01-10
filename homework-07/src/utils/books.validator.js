/**
 * @param {Object} data
 * @returns {string[]}
 */
export const validateCreateData = (data) => {
    const errors = []
    const {id, title, author, ...rest} = data;

    if (data.hasOwnProperty('id')) {
        errors.push('Property "id" cannot be set');
    }

    if (!title) {
        errors.push('Missing required property "title"');
    }

    if (typeof title !== 'string') {
        errors.push('Property "title" should be a string');
    }

    if (!author) {
        errors.push('Missing required property "author"');
    }

    if (typeof author !== 'string') {
        errors.push('Property "author" should be a string');
    }

    const keys = Object.keys(rest);
    if (keys.length) {
        errors.push(`Redundant data provided "${keys.join('", "')}"`);
    }

    return errors;
}

/**
 * @param {Object} data
 * @returns {string[]}
 */
export const validateUpdateData = (data) => {
    const errors = [];
    const {id, title, author, ...rest} = data;

    if (data.hasOwnProperty('id')) {
        errors.push('Property "id" cannot be set');
    }

    if (!title && !author) {
        errors.push('No data provided for update');
    }

    if (title && typeof title !== 'string') {
        errors.push('Property "title" should be a string');
    }

    if (author && typeof author !== 'string') {
        errors.push('Property "author" should be a string');
    }

    const keys = Object.keys(rest);
    if (keys.length) {
        errors.push(`Redundant data provided "${keys.join('", "')}"`);
    }

    return errors;
}
