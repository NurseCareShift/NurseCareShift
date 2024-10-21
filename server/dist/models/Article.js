"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Article.ts
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db/db"));
const User_1 = __importDefault(require("./User"));
// Articleクラス定義
class Article extends sequelize_1.Model {
}
// Articleモデルの初期化
Article.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
        onDelete: 'CASCADE', // Userが削除された場合、関連するArticleも削除
    },
    title: {
        type: new sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'タイトルを入力してください。',
            },
            len: {
                args: [1, 255],
                msg: 'タイトルは255文字以内である必要があります。',
            },
        },
    },
    content: {
        type: new sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'コンテンツを入力してください。',
            },
        },
    },
}, {
    tableName: 'articles',
    sequelize: db_1.default,
    timestamps: true, // createdAtとupdatedAtを自動生成
});
// リレーションを定義
Article.belongsTo(User_1.default, {
    targetKey: 'id',
    foreignKey: 'userId',
    as: 'user',
    onDelete: 'CASCADE', // ユーザー削除時に記事も削除
});
User_1.default.hasMany(Article, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'articles',
});
exports.default = Article;
