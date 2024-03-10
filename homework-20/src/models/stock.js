const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Stock extends Model {
    static associate(models) {
      this.belongsTo(models.Book, {
        foreignKey: {
          name: 'bookId'
        },
        as: 'book'
      });
    }
  }

  Stock.init({
    bookId: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
  }, {
    sequelize,
    modelName: 'Stock',
    tableName: 'stock',
    underscored: true
  });

  return Stock;
};
