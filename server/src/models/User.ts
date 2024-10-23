import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db/db';
import bcrypt from 'bcryptjs';
import Profile from './Profile';

// ユーザー属性のインターフェースをエクスポート
export interface IUser {
  id: number;
  email: string;
  password?: string;
  name?: string;
  isVerified: boolean;
  isActive: boolean; // ユーザーが有効かどうかを示すフラグ
  role: 'admin' | 'official' | 'general';
  profileImage?: string;
  verificationCode?: string;
  verificationCodeExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  passwordHistory: string[];
}

interface UserCreationAttributes extends Optional<IUser, 'id' | 'isVerified' | 'isActive' | 'role'> {}

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: number;
  public email!: string;
  public password?: string;
  public name?: string;
  public isVerified!: boolean;
  public isActive!: boolean; // ユーザーが有効かどうか
  public role!: 'admin' | 'official' | 'general';
  public profileImage?: string;
  public verificationCode?: string;
  public verificationCodeExpires?: Date;
  public resetPasswordToken?: string;
  public resetPasswordExpires?: Date;
  public passwordHistory!: string[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public profile?: Profile;

  // パスワード履歴をチェックする関数
  public async checkPasswordHistory(newPassword: string): Promise<boolean> {
    if (!this.passwordHistory || this.passwordHistory.length === 0) {
      return false; // パスワード履歴がない場合は false を返す
    }

    // パスワード履歴を非同期で並行処理
    const matches = await Promise.all(
      this.passwordHistory.map((oldPasswordHash) => bcrypt.compare(newPassword, oldPasswordHash))
    );

    return matches.includes(true); // 過去のパスワードと一致した場合
  }

  // パスワードの更新と履歴管理
  public async updatePassword(newPassword: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // パスワード履歴の制限（例: 5つの履歴を保持）
    if (this.passwordHistory.length >= 5) {
      this.passwordHistory.shift(); // 古いパスワードを削除
    }

    this.passwordHistory.push(hashedPassword);
    this.password = hashedPassword;
    await this.save();
  }
}

User.init(
  {
    // フィールドの定義
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: new DataTypes.STRING(128),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // メール形式の検証
      },
    },
    password: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: true,
    },
    profileImage: {
      type: new DataTypes.STRING(256),
      allowNull: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // ユーザーはデフォルトで有効
    },
    role: {
      type: DataTypes.ENUM('admin', 'official', 'general'),
      defaultValue: 'general',
      allowNull: false,
    },
    verificationCode: {
      type: new DataTypes.STRING(6),
      allowNull: true,
    },
    verificationCodeExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: new DataTypes.STRING(64),
      allowNull: true,
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordHistory: {
      type: DataTypes.JSON, // JSONを使ってパスワード履歴を保存
      allowNull: false,
      defaultValue: [], // 初期値として空配列を指定
    },
  },
  {
    tableName: 'users',
    sequelize,
    timestamps: true, // createdAtとupdatedAtを自動生成
    hooks: {
      // 保存前にパスワードをハッシュ化
      beforeSave: async (user: User) => {
        if (user.password && user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      },
    },
  }
);

export default User;
