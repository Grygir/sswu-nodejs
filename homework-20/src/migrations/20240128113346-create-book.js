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

    const { Op, where, fn, col } = Sequelize
    await queryInterface.addConstraint('books', {
      fields: ['title', 'price', 'year'],
      type: 'check',
      where: {
        [Op.and]: [
          where(fn('char_length', col('title')), {
            [Op.between]: [3, 140]
          }),
          {
            price: {
              [Op.gte]: 1
            }
          },{
            year: {
              [Op.between]: [1800, 2100]
            }
          }
        ]
      }
    });

    await queryInterface.addIndex('books', ['id', 'title']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('books');
  }
};
