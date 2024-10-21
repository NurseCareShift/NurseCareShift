import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';

// Profileの属性インターフェース
interface ProfileAttributes {
  id: number;
  userId: number;
  bio?: string;
  avatarUrl?: string;
}

// Profileの作成時に省略可能な属性を定義
interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id'> {}

// Profileクラス定義
class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: number;
  public userId!: number;
  public bio?: string;
  public avatarUrl?: string;

  // タイムスタンプ
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Profileモデルの初期化
Profile.init(
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
      onDelete: 'CASCADE', // Userが削除された場合、関連するProfileも削除
    },
    bio: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [0, 255], // 最大255文字に制限
      },
    },
    avatarUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true, // URL形式のバリデーション
      },
    },
  },
  {
    tableName: 'profiles',
    sequelize, // データベース接続
    timestamps: true, // createdAtとupdatedAtを自動生成
  }
);

export default Profile;
