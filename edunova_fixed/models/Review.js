const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Review', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5
    },
    comment: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('PENDING','APPROVED','REJECTED'),
      allowNull: false,
      defaultValue: "PENDING"
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Course',
        key: 'id'
      }
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
    tableName: 'Review',
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
        name: "Review_courseId_fkey",
        using: "BTREE",
        fields: [
          { name: "courseId" },
        ]
      },
      {
        name: "Review_userId_fkey",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
    ]
  });
};
