import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db'; // 既存のSequelizeインスタンスを使用

// Sessionモデルの属性インターフェース
interface SessionAttributes {
  id: number;
  userId: number;
  token: string;
  isActive: boolean;
}

// Session作成時に省略可能な属性を定義
interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> {}

// Sessionクラス定義
class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  public id!: number;
  public userId!: number;
  public token!: string;
  public isActive!: boolean;

  // タイムスタンプ
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Sessionモデルの初期化
Session.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE', // Userが削除された場合に関連するSessionも削除
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'sessions',
    timestamps: true, // createdAtとupdatedAtを自動生成
  }
);

export default Session;
