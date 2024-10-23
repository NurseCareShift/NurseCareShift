// src/models/Progress.ts

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';
import User from './User';

interface ProgressAttributes {
  id: number;
  userId: number;
  articleSlug: string;
  sectionId: number;
  status: 'understood' | 'review';
}

interface ProgressCreationAttributes extends Optional<ProgressAttributes, 'id'> {}

class Progress extends Model<ProgressAttributes, ProgressCreationAttributes> implements ProgressAttributes {
  public id!: number;
  public userId!: number;
  public articleSlug!: string;
  public sectionId!: number;
  public status!: 'understood' | 'review';

  // タイムスタンプ
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Progress.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    articleSlug: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    sectionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('understood', 'review'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'progress',
    timestamps: true,
  }
);

// リレーションの設定
User.hasMany(Progress, { foreignKey: 'userId', as: 'progresses', onDelete: 'CASCADE' });
Progress.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

export default Progress;
