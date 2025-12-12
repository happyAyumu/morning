import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Task } from '../lib/supabase';
import { Plus, LogOut, Zap } from 'lucide-react';
import { TaskCard } from '../components/dashboard/TaskCard';

type FilterType = 'all' | 'active' | 'completed' | 'failed';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [filter, setFilter] = React.useState<FilterType>('all');
  const [tasksLoading, setTasksLoading] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  React.useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setTasksLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.uid)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setTasks(data as Task[]);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setTasksLoading(false);
    }
  };

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

  const filteredTasks = React.useMemo(() => {
    if (filter === 'all') return tasks;
    if (filter === 'active') return tasks.filter((t) => t.status === 'pending' || t.status === 'active');
    return tasks.filter((t) => t.status === filter);
  }, [tasks, filter]);

  const stats = React.useMemo(() => {
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const failed = tasks.filter((t) => t.status === 'failed').length;
    const total = completed + failed;
    const achievementRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    const totalPenalty = tasks.filter((t) => t.status === 'failed').reduce((sum, t) => sum + t.penalty_amount, 0);

    return {
      achievementRate,
      streak: 0,
      totalPenalty,
    };
  }, [tasks]);

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
            <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">タスク一覧</h2>

                <div className="flex gap-2 overflow-x-auto">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                      filter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    すべて ({tasks.length})
                  </button>
                  <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                      filter === 'active'
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    進行中 ({tasks.filter((t) => t.status === 'pending' || t.status === 'active').length})
                  </button>
                  <button
                    onClick={() => setFilter('completed')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                      filter === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    完了 ({tasks.filter((t) => t.status === 'completed').length})
                  </button>
                  <button
                    onClick={() => setFilter('failed')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap ${
                      filter === 'failed'
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    失敗 ({tasks.filter((t) => t.status === 'failed').length})
                  </button>
                </div>
              </div>

              <div className="p-6">
                {tasksLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block">
                      <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-slate-600 mt-4">読み込み中...</p>
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-600 mb-4">
                      {filter === 'all'
                        ? 'タスクはまだ作成されていません。'
                        : `${
                            filter === 'active'
                              ? '進行中'
                              : filter === 'completed'
                              ? '完了した'
                              : '失敗した'
                          }タスクはありません。`}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-8 border border-slate-200 h-full">
              <h3 className="text-lg font-bold text-slate-900 mb-4">統計情報</h3>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">達成率</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.achievementRate}%</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-sm text-green-600 font-medium">連続達成日数</p>
                  <p className="text-3xl font-bold text-green-700">{stats.streak}日</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <p className="text-sm text-orange-600 font-medium">ペナルティ総額</p>
                  <p className="text-3xl font-bold text-orange-700">¥{stats.totalPenalty.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/create-task')}
          className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
        >
          <Plus className="w-6 h-6" />
          新しいタスクを作成
        </button>
      </main>
    </div>
  );
};
