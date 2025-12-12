import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
}

const statusConfig = {
  pending: {
    label: '準備中',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    icon: Clock,
  },
  active: {
    label: '監視中',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    icon: Clock,
  },
  completed: {
    label: '達成！',
    color: 'bg-green-100 text-green-700 border-green-300',
    icon: CheckCircle,
  },
  failed: {
    label: '未達成',
    color: 'bg-red-100 text-red-700 border-red-300',
    icon: XCircle,
  },
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();
  const status = statusConfig[task.status];
  const StatusIcon = status.icon;

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewDetails = () => {
    navigate(`/task/${task.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-1">
            {task.destination_name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4" />
            <span className="line-clamp-1">{task.destination_address}</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${status.color}`}
        >
          <StatusIcon className="w-4 h-4" />
          <span>{status.label}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span className="text-sm">
            目標: <span className="font-semibold">{formatDateTime(new Date(task.target_date_time))}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span className="text-sm text-slate-700">
            罰金額:
            <span className="text-lg font-bold text-red-600 ml-1">
              ¥{task.penalty_amount.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <button
          onClick={handleViewDetails}
          className="w-full py-2 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
          詳細を見る
        </button>
      </div>
    </div>
  );
};
