const {sequelize, Book, Genre} = require('../models');

const data = [
  ['To Kill a Mockingbird', ['southern gothic', 'bildungsroman']],
  ['The Great Gatsby', ['tragedy']],
  ['One Hundred Years of Solitude', ['magic realism']],
  ['Pride and Prejudice', ['classic regency novel', 'romance novel']],
  ['The Catcher in the Rye', ['realistic fiction', 'coming-of-age fiction']],
  ['Animal Farm', ['political satire']],
  ['Coming Up for Air', ['satire']],
  ['The Lord of the Rings', ['high fantasy', 'adventure']],
  ['The Diary of a Young Girl', ['autobiography', 'jewish literature']],
  ['The Talisman', ['dark fantasy']],
  ['Good Omens', ['horror', 'fantasy', 'comedy']]
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

      const uniqueGenres = data
          .map(row => row[1])
          .flat()
          .filter((genre, i, arr) => arr.indexOf(genre) === i)

      await queryInterface.bulkInsert('genres', uniqueGenres.map(name => ({ name })), {transaction});

      const genres = await Genre.findAll({attributes: ['id', 'name'], transaction});

      const genresMap = Object.fromEntries(genres.map(({ id, name }) => [ name, id ]));
      const booksMap = Object.fromEntries(books.map(({ id, title }) => [ title, id ]));
      const bookGenres =
          data.map(([title, genres]) => genres.map(genre => [booksMap[title], genresMap[genre]])).flat();

      await queryInterface.bulkInsert('book_genres', bookGenres.map(([book_id, genre_id]) => {
        return {
          book_id,
          genre_id
        }
      }), {transaction});
    });
  },

  async down (queryInterface, Sequelize) {
    await sequelize.transaction(async transaction => {
      await queryInterface.bulkDelete('genres', null, {transaction});
      await queryInterface.bulkDelete('book_genres', null, {transaction})
    });
  }
};
