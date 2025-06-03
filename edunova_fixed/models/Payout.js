const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Payout', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    method: {
      type: DataTypes.ENUM('BANK_TRANSFER','PAYPAL'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING','PROCESSING','COMPLETED','FAILED'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    requestedAt: {
      type: DataTypes.DATE(3),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(3)"
    },
    processedAt: {
      type: DataTypes.DATE(3),
      allowNull: true
    },
    instructorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Course',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'Payout',
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
        name: "Payout_instructorId_fkey",
        using: "BTREE",
        fields: [
          { name: "instructorId" },
        ]
      },
      {
        name: "Payout_courseId_fkey",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
    ]
  });
};