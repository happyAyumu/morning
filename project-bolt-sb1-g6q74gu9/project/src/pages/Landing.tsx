import React from 'react';
import { CheckCircle2, Zap, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-6">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">朝活チャレンジ</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2 text-white font-medium hover:text-blue-400 transition-colors"
            >
              ログイン
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              登録
            </button>
          </div>
        </nav>

        <div className="pt-20 pb-32">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              「やると言ったら
              <span className="text-blue-400">やる自分</span>
              」になろう
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              朝のタスクを達成できなかったら、ペナルティが発生。<br />
              自分自身への強制力で、真の習慣化を実現します。
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold text-lg rounded-xl hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              今すぐ始める
              <Zap className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">明確な目標</h3>
              <p className="text-gray-300">
                毎朝のタスクを明確に設定。行き先と到着時間を指定して、達成を可視化します。
              </p>
            </div>

            <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">リアルペナルティ</h3>
              <p className="text-gray-300">
                達成できなかった場合の実際のペナルティが発生。真剣度が違います。
              </p>
            </div>

            <div className="bg-slate-700/50 backdrop-blur border border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">習慣の力</h3>
              <p className="text-gray-300">
                21日間で習慣化。毎日の達成感が、あなたの人生を変えます。
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-700 bg-slate-900/50 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>© 2025 朝活チャレンジ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
