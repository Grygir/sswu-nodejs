const crypto = require('crypto');
const {sequelize, Author, Book} = require('../models');

const data = [
  ['To Kill a Mockingbird', ['Harper Lee'], 93.33, 1960],
  ['The Great Gatsby', ['F. Scott Fitzgerald'], 96.26, 1925, [
    ['Super book!', 'A timeless masterpiece that captures the essence of the American dream gone awry. Fitzgerald\'s prose is both beautiful and haunting. Definitely a must-read for any literature enthusiast.', 5],
    ['Hoped for better', 'While Fitzgerald\'s writing style is undoubtedly elegant, I found the characters unrelatable and the plot somewhat superficial. Not as engaging as I hoped.', 2],
    [void 0, 'Love it!', 4]
  ]],
  ['One Hundred Years of Solitude', ['Gabriel García Márquez'], 13.52, 1967],
  ['Pride and Prejudice', ['Jane Austen'], 24.52, 1813],
  ['The Catcher in the Rye', ['J.D. Salinger'], 36.51, 1951, [
    [void 0, 'Salinger\'s depiction of teenage angst and alienation is as relevant today as it was when first published. Holden Caulfield is a character you\'ll either love or hate, but definitely won\'t forget', 4],
    ['Not the best one', 'I struggled to sympathize with Holden\'s character. While the themes are significant, the narrative felt repetitive and somewhat aimless to me', 3]
  ]],
  ['Animal Farm', ['George Orwell'], 71.84, 1945],
  ['Coming Up for Air', ['George Orwell'], 71.84, 1939],
  ['The Lord of the Rings', ['J.R.R. Tolkien'], 72.79, 1955],
  ['The Diary of a Young Girl', ['Anne Frank'], 91.35, 1947],
  ['The Talisman', ['Stephen King', 'Peter Straub'], 99.25, 1984],
  ['Good Omens', ['Terry Pratchett', 'Neil Gaiman'], 76.80, 1990, [
    ['An absolute joy', 'A hilariously apocalyptic collaboration between Gaiman and Pratchett. This book combines the best of both authors\' styles - clever, witty, and utterly engrossing. An absolute joy to read', 5]
  ]]
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await sequelize.transaction(async transaction => {
      // Add Books
      await queryInterface.bulkInsert('books', data.map(([title,, price, year]) => {
        return {
          id: crypto.randomUUID(),
          title,
          price,
          year,
          created_at: new Date(),
          updated_at: new Date()
        };
      }), {transaction});

      // Add Authors
      const uniqueAuthors = data
          .map(row => row[1])
          .flat()
          .filter((author, i, arr) => arr.indexOf(author) === i)

      await queryInterface.bulkInsert('authors', uniqueAuthors.map(name => {
        return {
          id: crypto.randomUUID(),
          name,
          created_at: new Date(),
          updated_at: new Date(),
        }
      }), {transaction});

      // Add BookAuthors
      const [books, authors] = await Promise.all([
        Book.findAll({attributes: ['id', 'title'], transaction}),
        Author.findAll({attributes: ['id', 'name'], transaction})
      ]);
      const authorsMap = Object.fromEntries(authors.map(author => [author.name, author.id]));
      const booksMap = Object.fromEntries(books.map(book => [book.title, book.id]));
      const bookAuthors =
          data.map(([title, authors]) => authors.map(author => [booksMap[title], authorsMap[author]])).flat();

      await queryInterface.bulkInsert('book_authors', bookAuthors.map(([book_id, author_id]) => {
        return {
          book_id,
          author_id
        }
      }), {transaction});

      // Add Reviews
      const reviews = data.filter(([,,,, reviews]) => reviews)
        .map(([title,,,, reviews]) => reviews.map(review => [booksMap[title], ...review])).flat();

      await queryInterface.bulkInsert('reviews', reviews.map(([book_id, title, review, rating]) => {
        return {
          book_id,
          title,
          review,
          rating,
          created_at: new Date(),
          updated_at: new Date(),
        }
      }), {transaction});
    });
  },

  async down (queryInterface, Sequelize) {
    await sequelize.transaction(async transaction => {
      await queryInterface.bulkDelete('books', null, {transaction});
      await queryInterface.bulkDelete('authors', null, {transaction});
      await queryInterface.bulkDelete('book_authors', null, {transaction});
      await queryInterface.bulkDelete('reviews', null, {transaction});
    });
  }
};
