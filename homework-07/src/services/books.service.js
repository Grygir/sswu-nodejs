import fs from 'fs/promises';
import crypto  from 'crypto';
import * as booksValidator from "../utils/books.validator.js";

/**
 * @typedef {Object} Book
 * @property {UUID} id
 * @property {string} title
 * @property {string} author
 * @property {number} price not less than 1
 * @property {number?} year has to be in range 1900 <= year <= 2100
 * @property {string[]?} genres
 */

/**
 * @returns {Promise<{books: Book[]}>}
 */
async function getFileContent() {
    const  data = await fs.readFile('./books.json', {encoding: 'utf8'});
    return JSON.parse(data);
}

/**
 * @param {{books: Book[]}} data
 * @returns {Promise<void>}
 */
async function setFileContent(data) {
    const content = JSON.stringify(data, null, "  ");
    await fs.writeFile('./books.json', content, {encoding: 'utf8'});
}

/**
 * @returns {Promise<Book[]>}
 */
export const getAllBooks = async () => {
    return (await getFileContent()).books;
};

/**
 * @param {UUID} bookId
 * @returns {Promise<Book>}
 */
export const getBookById = async (bookId) => {
    const {books} = await getFileContent();
    return books.find(book => book.id === bookId);
};

/**
 * @param {title: string, author: string} data
 * @returns {Promise<Book>}
 */
export const createBook = async (data) => {
    booksValidator.validateCreateData(data);

    /** @type {Book} */
    const book = {
        id: crypto.randomUUID(),
        ...data
    };

    const {books} = await getFileContent();
    const newContent = {
        books: [...books, book]
    };
    await setFileContent(newContent);

    return book;
};

/**
 * @param {UUID} bookId
 * @param {title: string, author: string} data
 * @returns {Promise<Book|undefined>}
 */
export const updateBook = async (bookId, data) => {
    booksValidator.validateUpdateData(data);

    const {books} = await getFileContent();
    const book = books.find(book => book.id === bookId);

    if (book) {
        Object.assign(book, data);
        await setFileContent({books});
    }

    return book;
};

/**
 * @param {UUID} bookId
 * @returns {Promise<boolean>}
 */
export const deleteBook = async (bookId) => {
    const {books} = await getFileContent();
    const newContent = {
        books: books.filter(book => book.id !== bookId)
    };
    if (books.length !== newContent.books.length) {
        await setFileContent(newContent);
        return true;
    } else {
        return false;
    }
};
