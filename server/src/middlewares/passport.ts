import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as TwitterStrategy } from 'passport-twitter';
import { Strategy as InstagramStrategy } from 'passport-instagram';
import User from '../models/User';

// 各 OAuth のクライアントID、シークレット、コールバックURLを設定
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const GOOGLE_CALLBACK_URL = `${process.env.SERVER_URL}/auth/google/callback`;

const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY || '';
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET || '';
const TWITTER_CALLBACK_URL = `${process.env.SERVER_URL}/auth/twitter/callback`;

const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID || '';
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET || '';
const INSTAGRAM_CALLBACK_URL = `${process.env.SERVER_URL}/auth/instagram/callback`;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !TWITTER_CONSUMER_KEY || !TWITTER_CONSUMER_SECRET || !INSTAGRAM_CLIENT_ID || !INSTAGRAM_CLIENT_SECRET) {
  throw new Error('OAuth のクライアントIDまたはシークレットが設定されていません');
}

// ユーザーの検索・作成を共通化
const findOrCreateUser = async (email: string) => {
  try {
    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        email,
        isVerified: true,
        role: 'general',
        passwordHistory: [], // SNSログインではパスワードは管理しない
      });
    }
    return user;
  } catch (error) {
    throw new Error('ユーザーの作成中にエラーが発生しました。');
  }
};

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error('Google アカウントにメールアドレスが設定されていません。'), false);
        }

        const user = await findOrCreateUser(email);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Twitter OAuth Strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: TWITTER_CALLBACK_URL,
    },
    async (token, tokenSecret, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error('Twitter アカウントにメールアドレスが設定されていません。'), false);
        }

        const user = await findOrCreateUser(email);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// Instagram OAuth Strategy
passport.use(
  new InstagramStrategy(
    {
      clientID: INSTAGRAM_CLIENT_ID,
      clientSecret: INSTAGRAM_CLIENT_SECRET,
      callbackURL: INSTAGRAM_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(new Error('Instagram アカウントにメールアドレスが設定されていません。'), false);
        }

        const user = await findOrCreateUser(email);
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

// serializeUser and deserializeUser
passport.serializeUser((user: Express.User, done) => {
  // シリアライズ時にユーザーIDのみをセッションに保存
  done(null, (user as User).id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return done(new Error('ユーザーが見つかりません。'), null);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.deserializeUser(async (id: number, done) => {
    try {
      // ユーザーをIDで取得し、必要なフィールドのみを選択して負荷を軽減
      const user = await User.findByPk(id, {
        attributes: ['id', 'email', 'name', 'isActive'], // 必要なフィールドのみ取得
      });
  
      // ユーザーが見つからない場合
      if (!user) {
        return done(new Error('ユーザーが見つかりません。'), null);
      }
  
      // ユーザーが無効化されている場合（例: isActive フラグ）
      if (!user.isActive) {
        return done(new Error('このユーザーは無効化されています。'), null);
      }
  
      // 成功した場合、ユーザーオブジェクトをセッションに保存
      done(null, user);
    } catch (error) {
      // エラーハンドリング: エラーメッセージをログに残す
      console.error('ユーザーのデシリアライズ中にエラーが発生しました:', error);
  
      // エラー発生時には適切なメッセージとともに処理を終了
      done(new Error('デシリアライズ中にエラーが発生しました。'), null);
    }
  });
  

export default passport;
