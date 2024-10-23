"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.Profile = exports.User = void 0;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Profile_1 = __importDefault(require("./Profile"));
exports.Profile = Profile_1.default;
const Session_1 = __importDefault(require("./Session"));
exports.Session = Session_1.default;
// リレーションを定義
// UserとProfileのリレーション
User_1.default.hasOne(Profile_1.default, { foreignKey: 'userId', as: 'profile', onDelete: 'CASCADE' });
Profile_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
// UserとSessionのリレーション（1対多）
User_1.default.hasMany(Session_1.default, { foreignKey: 'userId', as: 'sessions', onDelete: 'CASCADE' });
Session_1.default.belongsTo(User_1.default, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });
