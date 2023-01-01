"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reset_pass extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User);
    }
  }
  Reset_pass.init(
    {
      userId: DataTypes.STRING,
      token: DataTypes.STRING,
      time: {
        type: DataTypes.DATE,
        defaultValue: Date.now() + 1000 * 60 * 2,
      },
    },
    {
      sequelize,
      modelName: "Reset_pass",
    }
  );
  return Reset_pass;
};
