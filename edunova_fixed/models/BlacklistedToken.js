const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('BlacklistedToken', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING(768),
      allowNull: false,
      unique: "BlacklistedToken_token_key"
    },
    expiresAt: {
      type: DataTypes.DATE(3),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'BlacklistedToken',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "BlacklistedToken_token_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "token" },
        ]
      },
    ]
  });
};
