const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Notification', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    message: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('EMAIL','IN_APP'),
      allowNull: false
    },
    readStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Notification',
    timestamps: true,
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
        name: "Notification_userId_fkey",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
