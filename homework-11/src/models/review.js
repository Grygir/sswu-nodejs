const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Book, {
        foreignKey: {
          name: 'bookId'
        }
      });
    }

    toJSON() {
      return {...this.get(), createdAt: undefined, updatedAt: undefined};
    }
  }

  Review.init({
    title: {
      type: DataTypes.STRING(140),
      validate: {
        len: [3, 140]
      }
    },
    review: DataTypes.TEXT,
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
    underscored: true
  });
  return Review;
};
