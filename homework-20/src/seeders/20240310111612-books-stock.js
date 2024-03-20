const {sequelize, Book} = require('../models');

const data = [
  ['To Kill a Mockingbird', 15],
  ['The Great Gatsby', 100],
  ['One Hundred Years of Solitude', 1],
  ['Pride and Prejudice', 70],
  ['The Catcher in the Rye', 3],
  ['Animal Farm', 7],
  ['Coming Up for Air', 34],
  ['The Lord of the Rings', 42],
  ['The Diary of a Young Girl', 17],
  ['The Talisman', 3],
  ['Good Omens', 13]
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await sequelize.transaction(async transaction => {
      const books = await Book.findAll({
        attributes: ['id', 'title'],
        transaction,
        where: {
          title: data.map(row => row[0])
        }
      })

      await queryInterface.bulkInsert('stock', books.map((book) => {
        return {
          book_id: book.id,
          quantity: data.find(row => row[0] === book.title)[1],
          created_at: new Date(),
          updated_at: new Date(),
        }
      }), {transaction});
    });
  },

  async down (queryInterface, Sequelize) {
    await sequelize.transaction(async transaction => {
      await queryInterface.bulkDelete('stock', null, {transaction});
    });
  }
};
