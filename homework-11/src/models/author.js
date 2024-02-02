const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Author extends Model {
    static associate(models) {
      this.belongsToMany(models.Book, {
        through: 'BookAuthor',
        as: 'books'
      });
    }

    toJSON() {
      return {...this.get(), createdAt: undefined, updatedAt: undefined};
    }
  }

  Author.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(140),
      unique: true,
      allowNull: false,
      validate: {
       len: [3, 140]
      }
    }
  }, {
    sequelize,
    modelName: 'Author',
    underscored: true
  });

  return Author;
};
