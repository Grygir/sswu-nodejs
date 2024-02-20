const {Model} = require('sequelize');

module.exports = (sequelize) => {
  class BookAuthor extends Model {
    static associate(models) {
      this.belongsTo(models.Book, {
        foreignKey: {
          name: 'bookId'
        }
      });
      this.belongsTo(models.Author, {
        foreignKey: {
          name: 'authorId'
        }
      });
    }
  }

  BookAuthor.init({
  }, {
    sequelize,
    modelName: 'BookAuthor',
    underscored: true,
    timestamps: false
  });
  return BookAuthor;
};
