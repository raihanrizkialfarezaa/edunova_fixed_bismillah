const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AssignmentSubmission', {
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
    assignmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Assignment',
        key: 'id'
      }
    },
    fileUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'Cloudinary file URL'
    },
    fileName: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
    fileType: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'File size in bytes'
    },
    cloudinaryPublicId: {
      type: DataTypes.STRING(191),
      allowNull: false,
      comment: 'Cloudinary public ID for file management'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Student description/notes about their submission'
    },
    score: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: null
    },
    maxScore: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 100
    },
    status: {
      type: DataTypes.ENUM('SUBMITTED','GRADED','LATE_SUBMITTED'),
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
    },
    isLate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'AssignmentSubmission',
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
        name: "AssignmentSubmission_userId_fkey",
        using: "BTREE",
        fields: [
          { name: "userId" },
        ]
      },
      {
        name: "AssignmentSubmission_assignmentId_fkey",
        using: "BTREE",
        fields: [
          { name: "assignmentId" },
        ]
      },
      {
        name: "AssignmentSubmission_gradedBy_fkey",
        using: "BTREE",
        fields: [
          { name: "gradedBy" },
        ]
      },
      {
        name: "AssignmentSubmission_userId_assignmentId_unique",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "userId" },
          { name: "assignmentId" },
        ]
      },
    ]
  });
};