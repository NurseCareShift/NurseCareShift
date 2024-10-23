"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db/db"));
// Profileクラス定義
class Profile extends sequelize_1.Model {
}
// Profileモデルの初期化
Profile.init({
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
        onDelete: 'CASCADE', // Userが削除された場合、関連するProfileも削除
    },
    bio: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        validate: {
            len: [0, 255], // 最大255文字に制限
        },
    },
    avatarUrl: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isUrl: true, // URL形式のバリデーション
        },
    },
}, {
    tableName: 'profiles',
    sequelize: db_1.default, // データベース接続
    timestamps: true, // createdAtとupdatedAtを自動生成
});
exports.default = Profile;
