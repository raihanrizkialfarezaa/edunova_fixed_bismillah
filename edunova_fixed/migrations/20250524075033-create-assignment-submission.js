'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AssignmentSubmission', {
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
      assignmentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Assignment',
          key: 'id'
        }
      },
      fileUrl: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      fileName: {
        type: Sequelize.STRING(191),
        allowNull: false
      },
      fileType: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      fileSize: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      cloudinaryPublicId: {
        type: Sequelize.STRING(191),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      score: {
        type: Sequelize.DOUBLE,
        allowNull: true,
        defaultValue: null
      },
      maxScore: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 100
      },
      status: {
        type: Sequelize.ENUM('SUBMITTED', 'GRADED', 'LATE_SUBMITTED'),
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
      isLate: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    await queryInterface.addConstraint('AssignmentSubmission', {
      fields: ['userId', 'assignmentId'],
      type: 'unique',
      name: 'AssignmentSubmission_userId_assignmentId_unique'
    });

    // Add indexes
    await queryInterface.addIndex('AssignmentSubmission', ['userId'], {
      name: 'AssignmentSubmission_userId_fkey',
      using: 'BTREE'
    });
    await queryInterface.addIndex('AssignmentSubmission', ['assignmentId'], {
      name: 'AssignmentSubmission_assignmentId_fkey',
      using: 'BTREE'
    });
    await queryInterface.addIndex('AssignmentSubmission', ['gradedBy'], {
      name: 'AssignmentSubmission_gradedBy_fkey',
      using: 'BTREE'
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('AssignmentSubmission');
  }
};