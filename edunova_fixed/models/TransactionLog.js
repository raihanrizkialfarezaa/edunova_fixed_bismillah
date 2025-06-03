const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('TransactionLog', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM('INCOME','PAYOUT'),
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    paymentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Payment',
        key: 'id'
      }
    },
    payoutId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Payout',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'TransactionLog',
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
        name: "TransactionLog_paymentId_fkey",
        using: "BTREE",
        fields: [
          { name: "paymentId" },
        ]
      },
      {
        name: "TransactionLog_payoutId_fkey",
        using: "BTREE",
        fields: [
          { name: "payoutId" },
        ]
      },
    ]
  });
};
