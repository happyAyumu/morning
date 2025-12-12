import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { DestinationSection } from '../components/task/DestinationSection';
import { DateTimeSection } from '../components/task/DateTimeSection';
import { PenaltyAmountSection } from '../components/task/PenaltyAmountSection';
import { PaymentSection } from '../components/task/PaymentSection';
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

  React.useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const calculateGpsActivationTime = (targetDate: Date): Date => {
    return new Date(targetDate.getTime() - 6 * 60 * 60 * 1000);
  };

  const handleSubmit = async () => {
    if (!user || !destination || !targetDateTime) {
      setError('すべての必須項目を入力してください');
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
      });

      if (insertError) {
        throw insertError;
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error creating task:', err);
      setError('タスクの作成に失敗しました。もう一度お試しください。');
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

          <PaymentSection disabled />
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
