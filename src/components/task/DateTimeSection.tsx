import React from 'react';
import DatePicker from 'react-datepicker';
import { Calendar, Clock } from 'lucide-react';

interface DateTimeSectionProps {
  targetDateTime: Date | null;
  onDateTimeChange: (date: Date | null) => void;
}

export const DateTimeSection: React.FC<DateTimeSectionProps> = ({
  targetDateTime,
  onDateTimeChange,
}) => {
  const minDate = new Date(Date.now() + 4 * 60 * 60 * 1000);

  const calculateGpsActivationTime = (targetDate: Date | null): string => {
    if (!targetDate) return '未設定';
    const gpsTime = new Date(targetDate.getTime() - 6 * 60 * 60 * 1000);
    return gpsTime.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">日時設定</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            目標到着日時
          </label>
          <DatePicker
            selected={targetDateTime}
            onChange={onDateTimeChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy年MM月dd日 HH:mm"
            minDate={minDate}
            placeholderText="日時を選択してください"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <p className="text-xs text-slate-500 mt-2">
            現在時刻の4時間後以降のみ選択可能です
          </p>
        </div>

        {targetDateTime && (
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 text-sm mb-1">
                  GPS監視開始時刻
                </p>
                <p className="text-amber-800">
                  {calculateGpsActivationTime(targetDateTime)}
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  GPS監視は目標時刻の6時間前から自動的に開始されます
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
