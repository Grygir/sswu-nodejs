/** @type {import('jest').Config} */
export default {
    transform: {},
    globals: {
        __DEV__: true,
    },
    moduleNameMapper: {
        './books.storage.js': '<rootDir>test/services/__mock__/books.storage.js',
    }
}
