import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Hero セクション */}
      <div className="relative h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(https://via.placeholder.com/1920x1080)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-400 opacity-75"></div>
        <motion.div
          className="relative z-10 text-center text-white px-4"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-6xl font-extrabold mb-4">看護師の成長をサポート</h1>
          <p className="text-lg mb-8">現場で役立つ知識とスキルを提供するオンラインプラットフォーム</p>
          {user ? (
            <Link
              to="/dashboard"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
            >
              ダッシュボードに移動する
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-green-400 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
              >
                新規登録
              </Link>
              <Link
                to="/login"
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
              >
                ログインして始める
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* 機能紹介セクション */}
      <section className="py-16 bg-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">プラットフォームの主な機能</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div
              className="bg-blue-50 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-2xl font-bold mb-4">100以上の公式記事</h3>
              <p className="text-gray-600">基礎知識から応用まで幅広いコンテンツを提供し、学習をサポートします。</p>
            </motion.div>
            <motion.div
              className="bg-blue-50 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4">経験値システム</h3>
              <p className="text-gray-600">学んだ知識を評価し、レベルアップして成長を実感できます。</p>
            </motion.div>
            <motion.div
              className="bg-blue-50 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-4">コミュニティ交流</h3>
              <p className="text-gray-600">他の看護師と意見交換や学び合いができる掲示板機能を備えています。</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* サービスの利点セクション */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">なぜこのプラットフォームが選ばれるのか？</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              className="p-6"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h3 className="text-2xl font-bold mb-4">リアルな現場に即した学び</h3>
              <p className="text-gray-600">現場で役立つ実践的な知識を学び、即戦力となるスキルを身につけます。</p>
            </motion.div>
            <motion.div
              className="p-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold mb-4">継続的な自己学習を促進</h3>
              <p className="text-gray-600">成長を可視化し、継続的に学ぶことでキャリアを飛躍させます。</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 行動を促すセクション */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <div className="container mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
          >
            今すぐキャリアアップを始めましょう！
          </motion.h2>
          {user ? (
            <Link
              to="/dashboard"
              className="bg-white text-blue-500 hover:bg-gray-200 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
            >
              ダッシュボードに移動する
            </Link>
          ) : (
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-green-500 hover:bg-gray-200 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
              >
                新規登録
              </Link>
              <Link
                to="/login"
                className="bg-white text-blue-500 hover:bg-gray-200 font-bold py-3 px-8 rounded-full shadow-lg transition duration-300"
              >
                ログイン
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 NurseCareShift. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
