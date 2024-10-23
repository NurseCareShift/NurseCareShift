"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class User extends sequelize_1.Model {
    // パスワード履歴をチェックする関数
    checkPasswordHistory(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.passwordHistory || this.passwordHistory.length === 0) {
                return false; // パスワード履歴がない場合は false を返す
            }
            // パスワード履歴を非同期で並行処理
            const matches = yield Promise.all(this.passwordHistory.map((oldPasswordHash) => bcryptjs_1.default.compare(newPassword, oldPasswordHash)));
            return matches.includes(true); // 過去のパスワードと一致した場合
        });
    }
    // パスワードの更新と履歴管理
    updatePassword(newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 12);
            // パスワード履歴の制限（例: 5つの履歴を保持）
            if (this.passwordHistory.length >= 5) {
                this.passwordHistory.shift(); // 古いパスワードを削除
            }
            this.passwordHistory.push(hashedPassword);
            this.password = hashedPassword;
            yield this.save();
        });
    }
}
User.init({
    // フィールドの定義
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true, // メール形式の検証
        },
    },
    password: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    name: {
        type: new sequelize_1.DataTypes.STRING(128),
        allowNull: true,
    },
    profileImage: {
        type: new sequelize_1.DataTypes.STRING(256),
        allowNull: true,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('admin', 'official', 'general'),
        defaultValue: 'general',
        allowNull: false,
    },
    verificationCode: {
        type: new sequelize_1.DataTypes.STRING(6),
        allowNull: true,
    },
    verificationCodeExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    resetPasswordToken: {
        type: new sequelize_1.DataTypes.STRING(64),
        allowNull: true,
    },
    resetPasswordExpires: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    passwordHistory: {
        type: sequelize_1.DataTypes.JSON, // JSONを使ってパスワード履歴を保存
        allowNull: false,
        defaultValue: [], // 初期値として空配列を指定
    },
}, {
    tableName: 'users',
    sequelize: db_1.default,
    timestamps: true, // createdAtとupdatedAtを自動生成
    hooks: {
        // 保存前にパスワードをハッシュ化
        beforeSave: (user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.password && user.changed('password')) {
                user.password = yield bcryptjs_1.default.hash(user.password, 12);
            }
        }),
    },
});
exports.default = User;
