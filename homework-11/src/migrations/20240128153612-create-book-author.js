'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('book_authors', {
      author_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'authors',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      book_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'books',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    });

    await queryInterface.addConstraint('book_authors', {
      fields: ['author_id', 'book_id'],
      type: 'primary key'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('book_authors');
  }
};
