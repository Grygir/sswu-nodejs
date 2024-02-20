/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      first_name: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(80),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(),
        unique: true,
        allowNull: false
      },
      password_hash: {
        type: Sequelize.STRING(),
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

    await queryInterface.addIndex('users', ['id', 'email']);

    const { Op, where, fn, col } = Sequelize
    await queryInterface.addConstraint('users', {
      fields: ['first_name', 'last_name'],
      type: 'check',
      where: {
        [Op.and]: [
          where(fn('char_length', col('first_name')), {
            [Op.between]: [2, 80]
          }),
          where(fn('char_length', col('last_name')), {
            [Op.between]: [2, 80]
          })
        ]
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('users');
  }
};
