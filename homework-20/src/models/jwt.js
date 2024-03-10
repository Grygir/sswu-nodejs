const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class JWT extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId'
        }
      });
    }
  }

  JWT.init({
    jwtid: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('access', 'refresh'),
      allowNull: false
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {

    sequelize,
    modelName: 'JWT',
    tableName: 'jwts',
    underscored: true,
    timestamps: false
  });

  JWT.removeAttribute('id');
  return JWT;
};
