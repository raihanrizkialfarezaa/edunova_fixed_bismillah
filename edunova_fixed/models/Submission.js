const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Submission', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    quizId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Quiz',
        key: 'id'
      }
    },
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Assignment',
        key: 'id'
      }
    },
    score: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    feedback: {
      type: DataTypes.STRING(191),
      allowNull: true
    },
    submittedAt: {
      type: DataTypes.DATE(3),
      allowNull: false,
      defaultValue: "CURRENT_TIMESTAMP(3)"
    }
  }, {
    sequelize,
    tableName: 'Submission',
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
        name: "Submission_userId_fkey",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "Submission_quizId_fkey",
        using: "BTREE",
        fields: [
          { name: "quizId" },
        ]
      },
      {
        name: "Submission_assignmentId_fkey",
        using: "BTREE",
        fields: [
          { name: "assignmentId" },
        ]
      },
    ]
  });
};
