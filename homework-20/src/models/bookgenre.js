const {Model} = require('sequelize');

module.exports = (sequelize) => {
  class BookGenre extends Model {
    static associate(models) {
      this.belongsTo(models.Book, {
        foreignKey: {
          name: 'bookId'
        }
      });
      this.belongsTo(models.Genre, {
        foreignKey: {
          name: 'genreId'
        }
      });
    }
  }

  BookGenre.init({
  }, {
    sequelize,
    modelName: 'BookGenre',
    underscored: true,
    timestamps: false
  });

  return BookGenre;
};
