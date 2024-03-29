'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.task.belongsTo(models.goal)
    }
  }
  task.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    due_date: DataTypes.DATEONLY,
    goalId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'task',
  });
  return task;
};