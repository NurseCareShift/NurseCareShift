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
exports.sendPasswordResetEmail = exports.sendPasswordChangeNotification = exports.sendEmailChangeVerification = exports.sendVerificationEmail = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// 環境変数からメールサーバーの設定を取得
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_SECURE = process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : undefined; // TLSを使用するかどうか
const EMAIL_FROM = process.env.EMAIL_FROM || `"YourAppName" <${EMAIL_USER}>`;
// 必須の環境変数が設定されているかチェック
if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS) {
    throw new Error('メールサーバーの設定が環境変数に正しく設定されていません。');
}
// EMAIL_SECURE が未設定の場合、ポート番号に応じて自動設定
const port = EMAIL_PORT;
const secure = EMAIL_SECURE !== undefined ? EMAIL_SECURE : port === 465;
// Nodemailerのトランスポート設定
const transporter = nodemailer_1.default.createTransport({
    host: EMAIL_HOST,
    port: port,
    secure: secure, // true for 465, false for other ports
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
const sendEmail = (to, subject, text, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: EMAIL_FROM, // 送信元
            to, // 送信先
            subject, // 件名
            text, // プレーンテキストの本文
            html, // HTML形式の本文（省略可能）
        };
        // メールを送信
        const info = yield transporter.sendMail(mailOptions);
        console.log(`メール送信成功: ${info.messageId}`);
    }
    catch (error) {
        console.error('メール送信エラー:', error);
        throw new Error('メールの送信に失敗しました。');
    }
});
exports.sendEmail = sendEmail;
/**
 * メールアドレス確認用の認証コードを送信する関数
 * @param to - 送信先のメールアドレス
 * @param verificationCode - 認証コード
 */
const sendVerificationEmail = (to, verificationCode) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'メールアドレス確認のご案内';
    const text = `以下の確認コードを入力して、メールアドレスを確認してください: ${verificationCode}`;
    const html = `<p>以下の確認コードを入力して、メールアドレスを確認してください:</p><h2>${verificationCode}</h2>`;
    yield (0, exports.sendEmail)(to, subject, text, html);
});
exports.sendVerificationEmail = sendVerificationEmail;
/**
 * メールアドレス変更確認用のメール送信関数
 * @param to - 送信先のメールアドレス
 * @param verificationLink - メールアドレス確認のためのリンク
 */
const sendEmailChangeVerification = (to, verificationLink) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'メールアドレス変更の確認';
    const text = `メールアドレスを変更するには、以下のリンクをクリックしてください: ${verificationLink}`;
    const html = `<p>メールアドレスを変更するには、以下のリンクをクリックしてください:</p><a href="${verificationLink}">${verificationLink}</a>`;
    yield (0, exports.sendEmail)(to, subject, text, html);
});
exports.sendEmailChangeVerification = sendEmailChangeVerification;
/**
 * パスワード変更通知メールを送信する関数
 * @param to - 送信先のメールアドレス
 */
const sendPasswordChangeNotification = (to) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'パスワード変更のお知らせ';
    const text = 'あなたのパスワードが変更されました。覚えのない変更であれば、早急にご連絡ください。';
    const html = `<p>あなたのパスワードが変更されました。覚えがない場合は、早急にご連絡ください。</p>`;
    yield (0, exports.sendEmail)(to, subject, text, html);
});
exports.sendPasswordChangeNotification = sendPasswordChangeNotification;
/**
 * パスワードリセットのためのメールを送信する関数
 * @param to - 送信先のメールアドレス
 * @param resetLink - パスワードリセットのためのリンク
 */
const sendPasswordResetEmail = (to, resetLink) => __awaiter(void 0, void 0, void 0, function* () {
    const subject = 'パスワードリセットのご案内';
    const text = `以下のリンクをクリックしてパスワードをリセットしてください: ${resetLink}`;
    const html = `<p>以下のリンクをクリックしてパスワードをリセットしてください:</p><a href="${resetLink}">${resetLink}</a>`;
    yield (0, exports.sendEmail)(to, subject, text, html);
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
