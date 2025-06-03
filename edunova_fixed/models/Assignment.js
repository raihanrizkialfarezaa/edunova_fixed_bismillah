const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Assignment', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    lessonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Lesson',
        key: 'id'
      },
      unique: "Assignment_lessonId_fkey"
    },
    dueDate: {
      type: DataTypes.DATE(3),
      allowNull: false
    },
    fileTypes: {
      type: DataTypes.JSON,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Assignment',
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
        name: "Assignment_lessonId_key",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "lessonId" },
        ]
      },
    ]
  });
};
