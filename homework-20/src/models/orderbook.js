const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class OrderBook extends Model {
    static associate(models) {
      this.belongsTo(models.Order, {
        foreignKey: {
          name: 'orderId'
        }
      });
      this.belongsTo(models.Book, {
        foreignKey: {
          name: 'bookId'
        },
        as: 'book'
      });
    }

    toJSON() {
      return {...this.get(), orderId: undefined};
    }
  }

  OrderBook.init({
    quantity: {
      type: DataTypes.INTEGER,
      validate: {
        max: 10,
        min: 1
      }
    }
  }, {
    sequelize,
    modelName: 'OrderBook',
    underscored: true,
    timestamps: false
  });

  return OrderBook;
};
