'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class goal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.goal.belongsTo(models.project)
      models.goal.hasMany(models.task)
    }
  }
  goal.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    img_url: DataTypes.STRING,
    due_date: DataTypes.DATEONLY,
    userId: DataTypes.INTEGER,
    projectId: DataTypes.INTEGER,
    complete: DataTypes.STRING,
    public: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'goal',
  });
  return goal;
};