/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('genres', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(140),
        allowNull: false
      }
    });

    const { Op, where, fn, col } = Sequelize
    await queryInterface.addConstraint('genres', {
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
    await queryInterface.dropTable('genres');
  }
};
