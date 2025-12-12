import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { PlaceLocation } from '../../types/task';

interface ConfirmationSectionProps {
  destination: PlaceLocation | null;
  targetDateTime: Date | null;
  penaltyAmount: number;
  agreedToTerms: boolean;
  onAgreedChange: (agreed: boolean) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const ConfirmationSection: React.FC<ConfirmationSectionProps> = ({
  destination,
  targetDateTime,
  penaltyAmount,
  agreedToTerms,
  onAgreedChange,
  onSubmit,
  isSubmitting = false,
}) => {
  const isFormValid =
    destination !== null &&
    targetDateTime !== null &&
    penaltyAmount >= 500 &&
    penaltyAmount <= 10000 &&
    agreedToTerms;

  const formatDateTime = (date: Date | null) => {
    if (!date) return '未設定';
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="sticky bottom-0 bg-white border-t-2 border-slate-200 shadow-2xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            <p className="text-lg font-bold text-slate-900">
              未達成時の引き落とし額:
              <span className="text-3xl text-red-600 ml-2">
                ¥{penaltyAmount.toLocaleString()}
              </span>
            </p>
          </div>

          <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-300 cursor-pointer hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => onAgreedChange(e.target.checked)}
              className="mt-1 w-5 h-5 text-red-600 border-slate-300 rounded focus:ring-red-500 cursor-pointer"
            />
            <span className="text-sm text-slate-700 leading-relaxed">
              <strong className="text-slate-900">
                {targetDateTime ? formatDateTime(targetDateTime) : '【目標時刻】'}
              </strong>
              に
              <strong className="text-slate-900">
                {destination ? destination.name : '【目的地】'}
              </strong>
              へ到着できなかった場合、上記の金額が自動的に引き落とされることに同意します
            </span>
          </label>

          <button
            onClick={onSubmit}
            disabled={!isFormValid || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
              isFormValid && !isSubmitting
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:scale-105'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? '作成中...' : '契約を確定してタスクを作成'}
          </button>

          {!isFormValid && !agreedToTerms && destination && targetDateTime && (
            <p className="text-xs text-red-600 text-center">
              契約条件に同意してください
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
