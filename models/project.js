'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.project.belongsTo(models.user)
      models.project.hasMany(models.task)
    }
  }
  project.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    img_url: DataTypes.STRING,
    due_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'project',
  });
  return project;
};