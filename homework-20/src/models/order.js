const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Order extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: 'userId'
        },
        as: 'user'
      });
      this.hasMany(models.OrderBook, {
        foreignKey: 'orderId',
        as: 'orderBooks'
      });
    }

    toJSON() {
      return {...this.get(), updatedAt: undefined};
    }
  }

  Order.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    }
  }, {
    sequelize,
    modelName: 'Order',
    underscored: true
  });

  return Order;
};
