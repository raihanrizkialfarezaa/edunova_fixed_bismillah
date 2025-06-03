const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Payment', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    totalAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    platformShare: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    instructorShare: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('PENDING','COMPLETED','FAILED','REFUNDED'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    transactionId: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    paymentMethod: {
      type: DataTypes.ENUM('CREDIT_CARD','BANK_TRANSFER','E_WALLET'),
      allowNull: true
    },
    enrollmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Enrollment',
        key: 'id'
      },
      unique: "Payment_enrollmentId_fkey"
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Payment',
    timestamps: true,
    paranoid: true,
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
        name: "Payment_enrollmentId_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "enrollmentId" },
        ]
      },
      {
        name: "Payment_instructorId_fkey",
        using: "BTREE",
        fields: [
          { name: "instructorId" },
        ]
      },
    ]
  });
};
