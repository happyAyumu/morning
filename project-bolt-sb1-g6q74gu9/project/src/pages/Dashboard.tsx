import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, LogOut, Zap, Clock } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
      navigate('/');
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-slate-900">朝活チャレンジ</h1>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden sm:block">
                <p className="text-sm text-gray-600">
                  こんにちは、<span className="font-semibold text-slate-900">{user.displayName}</span>さん
                </p>
              </div>
              <button
                onClick={handleSignOut}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                今日のタスク
              </h2>
              <p className="text-slate-600 mb-8">
                タスクはまだ作成されていません。下のボタンから新しいタスクを作成してください。
              </p>

              <div className="space-y-4">
                {/* Task list will appear here in future phases */}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200 h-full">
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                統計情報
              </h3>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">達成率</p>
                  <p className="text-3xl font-bold text-blue-700">0%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-600 font-medium">連続達成日数</p>
                  <p className="text-3xl font-bold text-green-700">0日</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-orange-600 font-medium">ペナルティ総額</p>
                  <p className="text-3xl font-bold text-orange-700">¥0</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg mb-12"
        >
          <Plus className="w-6 h-6" />
          新しいタスクを作成
        </button>

        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200">
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">
                朝活を始める準備はできていますか？
              </h3>
              <p className="text-slate-600 mb-4">
                毎日のタスク設定により、あなたの朝の時間が変わります。明確な目標を設定し、自分自身に強制力を持たせることで、真の習慣化が実現します。
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  行き先と到着時間を明確に設定
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  達成できなかった場合のペナルティを設定
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                  GPS機能で自動検証
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
