"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Verify_user extends Model {
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
  Verify_user.init(
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
      modelName: "Verify_user",
    }
  );
  return Verify_user;
};
