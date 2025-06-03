const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('QuizSubmission', {
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
      allowNull: false,
      references: {
        model: 'Quiz',
        key: 'id'
      }
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: false,
      comment: 'Array of answers: [{questionId: 1, selectedAnswer: "answer"}]'
    },
    score: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: null
    },
    totalPoints: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    earnedPoints: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    status: {
      type: DataTypes.ENUM('SUBMITTED','GRADED'),
      allowNull: false,
      defaultValue: "SUBMITTED"
    },
    submittedAt: {
      type: DataTypes.DATE(3),
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    gradedAt: {
      type: DataTypes.DATE(3),
      allowNull: true
    },
    gradedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'QuizSubmission',
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
        name: "QuizSubmission_userId_fkey",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "QuizSubmission_quizId_fkey",
        using: "BTREE",
        fields: [
          { name: "quizId" },
        ]
      },
      {
        name: "QuizSubmission_gradedBy_fkey",
        using: "BTREE",
        fields: [
          { name: "gradedBy" },
        ]
      },
      {
        name: "QuizSubmission_userId_quizId_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
          { name: "quizId" },
        ]
      },
    ]
  });
};