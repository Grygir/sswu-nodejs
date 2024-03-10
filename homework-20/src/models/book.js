const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {
    static associate(models) {
      this.belongsToMany(models.Author, {
        through: 'BookAuthor',
        as: 'authors'
      });
      this.hasMany(models.Review, {
        foreignKey: {
          name: 'bookId'
        },
        as: 'reviews'
      });
      this.hasMany(models.BookAuthor, {
        foreignKey: {
          name: 'bookId'
        },
        as: 'authorIds'
      });
      this.hasOne(models.Stock, {
        foreignKey: {
          name: 'bookId'
        },
        as: 'stock'
      });
    }

    toJSON() {
      return {...this.get(), createdAt: undefined, updatedAt: undefined};
    }
  }

  Book.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    title: {
      type: DataTypes.STRING(140),
      allowNull: false,
      validate: {
        len: [3, 140]
      }
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        max: 2100,
        min: 1800
      }
    }
  }, {
    sequelize,
    modelName: 'Book',
    underscored: true
  });

  return Book;
};
