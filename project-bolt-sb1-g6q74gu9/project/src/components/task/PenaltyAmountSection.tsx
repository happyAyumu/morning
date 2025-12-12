import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PenaltyAmountSectionProps {
  amount: number;
  onAmountChange: (amount: number) => void;
}

export const PenaltyAmountSection: React.FC<PenaltyAmountSectionProps> = ({
  amount,
  onAmountChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-bold text-slate-900">罰金額設定</h2>
      </div>

      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-sm text-slate-600 mb-3">罰金額</p>
          <p className="text-6xl font-bold text-red-600">
            ¥{amount.toLocaleString()}
          </p>
        </div>

        <div>
          <input
            type="range"
            min="500"
            max="10000"
            step="500"
            value={amount}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            style={{
              background: `linear-gradient(to right, #DC2626 0%, #DC2626 ${((amount - 500) / 9500) * 100}%, #E2E8F0 ${((amount - 500) / 9500) * 100}%, #E2E8F0 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-slate-500 mt-2">
            <span>¥500</span>
            <span>¥10,000</span>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-red-800 text-center font-medium">
            この金額は目標未達成時に自動で引き落とされます
          </p>
        </div>
      </div>
    </div>
  );
};
