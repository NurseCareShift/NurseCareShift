import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// 環境変数からメールサーバーの設定を取得
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.example.com';
const EMAIL_PORT = Number(process.env.EMAIL_PORT) || 587;
const EMAIL_USER = process.env.EMAIL_USER || 'your-email@example.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your-email-password';
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true'; // TLSを使用するかどうか

// Nodemailerのトランスポート設定
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * メール送信関数
 * @param to - 送信先のメールアドレス
 * @param subject - メールの件名
 * @param text - メールの本文（プレーンテキスト）
 * @param html - メールの本文（HTML形式）
 */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  try {
    const mailOptions = {
      from: `"YourAppName" <${EMAIL_USER}>`, // 送信元
      to, // 送信先
      subject, // 件名
      text, // プレーンテキストの本文
      html, // HTML形式の本文（省略可能）
    };

    // メールを送信
    const info = await transporter.sendMail(mailOptions);
    console.log(`メール送信成功: ${info.messageId}`);
  } catch (error) {
    console.error('メール送信エラー:', error);
    throw new Error('メールの送信に失敗しました。');
  }
};

/**
 * メールアドレス確認用の認証コードを送信する関数
 * @param to - 送信先のメールアドレス
 * @param verificationCode - 認証コード
 */
export const sendVerificationEmail = async (to: string, verificationCode: string): Promise<void> => {
  const subject = 'メールアドレス確認のご案内';
  const text = `以下の確認コードを入力して、メールアドレスを確認してください: ${verificationCode}`;
  const html = `<p>以下の確認コードを入力して、メールアドレスを確認してください:</p><h2>${verificationCode}</h2>`;

  await sendEmail(to, subject, text, html);
};

/**
 * メールアドレス変更確認用のメール送信関数
 * @param to - 送信先のメールアドレス
 * @param verificationLink - メールアドレス確認のためのリンク
 */
export const sendEmailChangeVerification = async (to: string, verificationLink: string): Promise<void> => {
  const subject = 'メールアドレス変更の確認';
  const text = `メールアドレスを変更するには、以下のリンクをクリックしてください: ${verificationLink}`;
  const html = `<p>メールアドレスを変更するには、以下のリンクをクリックしてください:</p><a href="${verificationLink}">${verificationLink}</a>`;

  await sendEmail(to, subject, text, html);
};

/**
 * パスワード変更通知メールを送信する関数
 * @param to - 送信先のメールアドレス
 */
export const sendPasswordChangeNotification = async (to: string): Promise<void> => {
  const subject = 'パスワード変更のお知らせ';
  const text = 'あなたのパスワードが変更されました。覚えのない変更であれば、早急にご連絡ください。';
  const html = `<p>あなたのパスワードが変更されました。覚えがない場合は、早急にご連絡ください。</p>`;

  await sendEmail(to, subject, text, html);
};

/**
 * パスワードリセットのためのメールを送信する関数
 * @param to - 送信先のメールアドレス
 * @param resetLink - パスワードリセットのためのリンク
 */
export const sendPasswordResetEmail = async (to: string, resetLink: string): Promise<void> => {
  const subject = 'パスワードリセットのご案内';
  const text = `以下のリンクをクリックしてパスワードをリセットしてください: ${resetLink}`;
  const html = `<p>以下のリンクをクリックしてパスワードをリセットしてください:</p><a href="${resetLink}">${resetLink}</a>`;

  await sendEmail(to, subject, text, html);
};
