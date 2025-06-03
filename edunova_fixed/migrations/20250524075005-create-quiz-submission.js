'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('QuizSubmission', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      quizId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Quiz',
          key: 'id'
        }
      },
      answers: {
        type: Sequelize.JSON,
        allowNull: false
      },
      score: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: null
      },
      totalPoints: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      earnedPoints: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: Sequelize.ENUM('SUBMITTED', 'GRADED'),
        allowNull: false,
        defaultValue: 'SUBMITTED'
      },
      submittedAt: {
        type: Sequelize.DATE(3),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
      },
      gradedAt: {
        type: Sequelize.DATE(3),
        allowNull: true
      },
      gradedBy: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'User',
          key: 'id'
        }
      },
      feedback: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add unique constraint index
    await queryInterface.addConstraint('QuizSubmission', {
      fields: ['userId', 'quizId'],
      type: 'unique',
      name: 'QuizSubmission_userId_quizId_unique'
    });

    // Add indexes
    await queryInterface.addIndex('QuizSubmission', ['userId'], {
      name: 'QuizSubmission_userId_fkey',
      using: 'BTREE'
    });
    await queryInterface.addIndex('QuizSubmission', ['quizId'], {
      name: 'QuizSubmission_quizId_fkey',
      using: 'BTREE'
    });
    await queryInterface.addIndex('QuizSubmission', ['gradedBy'], {
      name: 'QuizSubmission_gradedBy_fkey',
      using: 'BTREE'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('QuizSubmission');
  }
};