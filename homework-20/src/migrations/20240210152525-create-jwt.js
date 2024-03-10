/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jwts', {
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      jwtid: {
        allowNull: false,
        type: Sequelize.STRING(32)
      },
      type: {
        allowNull: false,
        type: Sequelize.ENUM('access', 'refresh')
      },
      expire_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('jwts', {
      fields: ['jwtid', 'type'],
      type: 'primary key'
    });
    await queryInterface.addIndex('jwts', ['expire_at']);
  },
  async down(queryInterface) {
    await queryInterface.dropTable('jwts');
  }
};
