// models/Post.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';

// Postの属性インターフェース
interface PostAttributes {
  id: number;
  userId: number;
  content: string;
}

// Post作成時に省略可能な属性を定義
interface PostCreationAttributes extends Optional<PostAttributes, 'id'> {}

// Postクラス定義
class Post extends Model<PostAttributes, PostCreationAttributes> implements PostAttributes {
  public id!: number;
  public userId!: number;
  public content!: string;

  // タイムスタンプ
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Postモデルの初期化
Post.init(
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
        model: 'users', // Userモデルを参照
        key: 'id',
      },
      onDelete: 'CASCADE', // Userが削除された場合、関連するPostも削除
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: '投稿内容は空にできません。',
        },
        len: {
          args: [1, 5000], // 投稿の最大文字数を5000文字に制限
          msg: '投稿は5000文字以内である必要があります。',
        },
      },
    },
  },
  {
    tableName: 'posts',
    sequelize,
    timestamps: true, // createdAtとupdatedAtを自動生成
  }
);

export default Post;
