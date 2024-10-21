// models/Article.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';
import User from './User';

// Articleの属性インターフェース
interface ArticleAttributes {
  id: number;
  userId: number;
  title: string;
  content: string;
}

// Article作成時に省略可能な属性を定義
interface ArticleCreationAttributes extends Optional<ArticleAttributes, 'id'> {}

// Articleクラス定義
class Article extends Model<ArticleAttributes, ArticleCreationAttributes> implements ArticleAttributes {
  public id!: number;
  public userId!: number;
  public title!: string;
  public content!: string;

  // タイムスタンプ
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Articleモデルの初期化
Article.init(
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
      onDelete: 'CASCADE', // Userが削除された場合、関連するArticleも削除
    },
    title: {
      type: new DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'タイトルを入力してください。',
        },
        len: {
          args: [1, 255], // タイトルの最大文字数を255文字に制限
          msg: 'タイトルは255文字以内である必要があります。',
        },
      },
    },
    content: {
      type: new DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'コンテンツを入力してください。',
        },
      },
    },
  },
  {
    tableName: 'articles',
    sequelize,
    timestamps: true, // createdAtとupdatedAtを自動生成
  }
);

// リレーションを定義
Article.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'CASCADE', // ユーザー削除時に記事も削除
});

User.hasMany(Article, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'articles',
});

export default Article;
