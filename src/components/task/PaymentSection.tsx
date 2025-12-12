import React from 'react';
import { CreditCard, Shield, CheckCircle } from 'lucide-react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

interface PaymentSectionProps {
  disabled?: boolean;
  onPaymentMethodReady?: (isReady: boolean) => void;
}

export const PaymentSection: React.FC<PaymentSectionProps> = ({
  disabled = false,
  onPaymentMethodReady
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isCardComplete, setIsCardComplete] = React.useState(false);
  const [cardError, setCardError] = React.useState<string | null>(null);

  const handleCardChange = (event: any) => {
    setCardError(event.error ? event.error.message : null);
    setIsCardComplete(event.complete);
    onPaymentMethodReady?.(event.complete);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">安全な決済情報の登録</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-6 py-4">
          <div className="flex items-center gap-2">
            <svg className="w-16 h-auto" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
              <path
                fill="#635BFF"
                d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.87zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.93 0 1.85 6.29.97 6.29 5.88z"
              />
            </svg>
            <Shield className="w-6 h-6 text-green-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-800 text-center font-medium flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            Stripe社のセキュアな通信を使用。カード情報は暗号化されて保護されます
          </p>
        </div>

        <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                カード情報
              </label>
              <div className="px-4 py-3 border border-slate-300 rounded-lg bg-white hover:border-blue-400 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#0f172a',
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        '::placeholder': {
                          color: '#94a3b8',
                        },
                      },
                      invalid: {
                        color: '#dc2626',
                      },
                    },
                  }}
                  onChange={handleCardChange}
                />
              </div>
              {cardError && (
                <p className="text-red-600 text-sm mt-1">{cardError}</p>
              )}
              {isCardComplete && !cardError && (
                <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  カード情報が正常に入力されました
                </p>
              )}
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-3 text-center">
            決済は目標未達成時のみ実行されます
          </p>
        </div>
      </div>
    </div>
  );
};
