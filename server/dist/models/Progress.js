"use strict";
// src/models/Progress.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db/db"));
const User_1 = __importDefault(require("./User"));
class Progress extends sequelize_1.Model {
}
Progress.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    articleSlug: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    sectionId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('understood', 'review'),
        allowNull: false,
    },
}, {
    sequelize: db_1.default,
    tableName: 'progress',
    timestamps: true,
});
// リレーションの設定
User_1.default.hasMany(Progress, { foreignKey: 'userId', as: 'progresses', onDelete: 'CASCADE' });
Progress.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
exports.default = Progress;
