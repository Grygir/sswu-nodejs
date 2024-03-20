const {Model, DataTypes} = require('sequelize');

module.exports = (sequelize) => {
  class Genre extends Model {
    static associate(models) {
      this.belongsToMany(models.Book, {
        through: 'BookGenre',
        as: 'books'
      });
    }
  }

  Genre.init({
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
    modelName: 'Genre',
    underscored: true,
    timestamps: false
  });

  return Genre;
};
