import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DestinationSection } from '../components/task/DestinationSection';
import { DateTimeSection } from '../components/task/DateTimeSection';
import { PenaltyAmountSection } from '../components/task/PenaltyAmountSection';
import { ConfirmationSection } from '../components/task/ConfirmationSection';
import { PlaceLocation } from '../types/task';

export const CreateTask: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [destination, setDestination] = React.useState<PlaceLocation | null>(null);
  const [targetDateTime, setTargetDateTime] = React.useState<Date | null>(null);
  const [penaltyAmount, setPenaltyAmount] = React.useState(5000);
  const [agreedToTerms, setAgreedToTerms] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<any>(null);
  const [loadingPaymentMethod, setLoadingPaymentMethod] = React.useState(true);

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      checkPaymentMethod();
    }
  }, [user, navigate]);

  const checkPaymentMethod = async () => {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('stripe_payment_method_id, payment_method_last4, payment_method_brand')
        .eq('id', user?.uid)
        .maybeSingle();

      if (data && data.stripe_payment_method_id) {
        setPaymentMethod(data);
      }
    } catch (err) {
      console.error('Error checking payment method:', err);
    } finally {
      setLoadingPaymentMethod(false);
    }
  };

  const calculateGpsActivationTime = (targetDate: Date): Date => {
    return new Date(targetDate.getTime() - 6 * 60 * 60 * 1000);
  };

  const handleSubmit = async () => {
    if (!user || !destination || !targetDateTime) {
      setError('すべての必須項目を入力してください');
      return;
    }

    if (!paymentMethod) {
      setError('カード情報を登録してください');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const gpsActivationTime = calculateGpsActivationTime(targetDateTime);

      const { error: insertError } = await supabase.from('tasks').insert({
        user_id: user.uid,
        destination_name: destination.name,
        destination_address: destination.address,
        destination_lat: destination.lat,
        destination_lng: destination.lng,
        target_date_time: targetDateTime.toISOString(),
        penalty_amount: penaltyAmount,
        gps_activation_time: gpsActivationTime.toISOString(),
        status: 'pending',
        stripe_payment_method_id: paymentMethod.stripe_payment_method_id,
        payment_status: 'pending',
      });

      if (insertError) {
        throw insertError;
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Error creating task:', err);
      setError(err.message || 'タスクの作成に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-32">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">戻る</span>
            </button>
            <h1 className="text-2xl font-bold text-slate-900">新しいタスクを作成</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm font-medium">{error}</p>
          </div>
        )}

        <div className="space-y-6">
          <DestinationSection
            destination={destination}
            onDestinationChange={setDestination}
          />

          <DateTimeSection
            targetDateTime={targetDateTime}
            onDateTimeChange={setTargetDateTime}
          />

          <PenaltyAmountSection
            amount={penaltyAmount}
            onAmountChange={setPenaltyAmount}
          />

          <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900">決済情報</h2>
            </div>

            {loadingPaymentMethod ? (
              <div className="text-center py-4">
                <div className="inline-block">
                  <div className="w-6 h-6 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-600 mt-2 text-sm">読み込み中...</p>
              </div>
            ) : paymentMethod ? (
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">登録済みカード</p>
                  <p className="text-green-700 text-sm mt-1">
                    {paymentMethod.payment_method_brand?.toUpperCase()} •••• {paymentMethod.payment_method_last4}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/payment-setup')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  カード情報を変更
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-medium">カード情報が未登録です</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    タスクを作成するにはカード情報の登録が必要です
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/payment-setup')}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  カード情報を登録する
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <ConfirmationSection
        destination={destination}
        targetDateTime={targetDateTime}
        penaltyAmount={penaltyAmount}
        agreedToTerms={agreedToTerms}
        onAgreedChange={setAgreedToTerms}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
