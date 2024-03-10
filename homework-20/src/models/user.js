const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      this.hasMany(models.JWT, {
        foreignKey: {
          name: 'userId'
        },
        as: 'jwts'
      });
    }

    toJSON() {
      return {
        ...this.get(),
        passwordHash: undefined,
        createdAt: undefined,
        updatedAt: undefined
      };
    }
  }

  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
       len: [2, 80]
      }
    },
    lastName: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        len: [2, 80]
      }
    },
    email: {
      type: DataTypes.STRING(),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING(),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    underscored: true
  });

  return User;
};
