/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING(140),
        allowNull: false
      },
      price: {
        type: Sequelize.DOUBLE,
        allowNull: false
      },
      year: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })

    await queryInterface.addConstraint('books', {
      fields: ['price'],
      type: 'check',
      where: {
        price: {
          [Sequelize.Op.gte]: 1
        }
      }
    });

    await queryInterface.addIndex('books', ['id', 'title']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('books');
  }
};
