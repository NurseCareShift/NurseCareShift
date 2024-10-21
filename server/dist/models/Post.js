"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Post.ts
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db/db"));
// Postクラス定義
class Post extends sequelize_1.Model {
}
// Postモデルの初期化
Post.init({
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
        onDelete: 'CASCADE', // Userが削除された場合、関連するPostも削除
    },
    content: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: '投稿内容は空にできません。',
            },
            len: {
                args: [1, 5000],
                msg: '投稿は5000文字以内である必要があります。',
            },
        },
    },
}, {
    tableName: 'posts',
    sequelize: db_1.default,
    timestamps: true, // createdAtとupdatedAtを自動生成
});
exports.default = Post;
