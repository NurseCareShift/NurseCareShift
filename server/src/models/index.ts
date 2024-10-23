import User from './User';
import Profile from './Profile';
import Session from './Session';

// リレーションを定義

// UserとProfileのリレーション
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

// UserとSessionのリレーション（1対多）
User.hasMany(Session, { foreignKey: 'userId', as: 'sessions', onDelete: 'CASCADE' });
Session.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

export { User, Profile, Session };
