/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('authors', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING(140),
        unique: true,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    const { Op, where, fn, col } = Sequelize
    await queryInterface.addConstraint('authors', {
      fields: ['name'],
      type: 'check',
      where: {
        [Op.and]: [
          where(fn('char_length', col('name')), {
            [Op.between]: [3, 140]
          })
        ]
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('authors');
  }
};
