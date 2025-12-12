import { CheckCircle } from 'lucide-react';

interface SuccessModalProps {
  onClose: () => void;
}

export function SuccessModal({ onClose }: SuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-24 h-24 text-green-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          目標達成！
        </h2>

        <p className="text-lg text-gray-600 mb-8">
          罰金は請求されませんでした
        </p>

        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
        >
          ダッシュボードに戻る
        </button>
      </div>
    </div>
  );
}
