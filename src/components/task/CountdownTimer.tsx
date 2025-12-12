import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDateTime: string;
}

export function CountdownTimer({ targetDateTime }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateTime).getTime();
      const difference = target - now;
      return Math.max(0, Math.floor(difference / 1000));
    };

    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDateTime]);

  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  const getBackgroundColor = () => {
    const totalMinutes = Math.floor(timeRemaining / 60);
    if (totalMinutes < 10) return 'bg-red-600 text-white';
    if (totalMinutes < 30) return 'bg-orange-500 text-white';
    if (totalMinutes < 60) return 'bg-orange-200 text-gray-900';
    return 'bg-white text-gray-900';
  };

  const formatTime = (value: number) => String(value).padStart(2, '0');

  return (
    <div className={`${getBackgroundColor()} rounded-lg p-6 text-center transition-colors duration-500`}>
      <div className="text-sm font-medium mb-2 opacity-75">残り時間</div>
      <div className="text-5xl font-bold font-mono">
        {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
      </div>
      {timeRemaining === 0 && (
        <div className="text-lg font-semibold mt-2">時間切れ</div>
      )}
    </div>
  );
}
