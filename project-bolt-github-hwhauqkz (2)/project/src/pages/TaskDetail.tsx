import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GoogleMap, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, AlertCircle, ArrowLeft, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Task } from '../types/task';
import { CountdownTimer } from '../components/task/CountdownTimer';
import { SuccessModal } from '../components/task/SuccessModal';
import { calculateDistance, formatDistance, getDistanceStatus } from '../utils/distance';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const CHECK_IN_RADIUS = 100;

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    if (!id) return;

    const fetchTask = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching task:', error);
        return;
      }

      if (data) {
        setTask(data);
      }
    };

    fetchTask();
  }, [id]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentPosition(pos);
        setGpsStatus('success');

        if (task) {
          const dist = calculateDistance(
            pos.lat,
            pos.lng,
            task.destination_lat,
            task.destination_lng
          );
          setDistance(dist);
        }
      },
      (error) => {
        console.error('GPS Error:', error);
        setGpsStatus('error');
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [task]);

  const handleCheckIn = async () => {
    if (!task || !currentPosition || !distance || distance > CHECK_IN_RADIUS) {
      return;
    }

    setIsCheckingIn(true);

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          check_in_lat: currentPosition.lat,
          check_in_lng: currentPosition.lng,
          check_in_time: new Date().toISOString(),
        })
        .eq('id', task.id);

      if (error) throw error;

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error checking in:', error);
      alert('チェックインに失敗しました');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!task) return;

    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;

      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('タスクの削除に失敗しました');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  const distanceStatus = distance !== null ? getDistanceStatus(distance) : null;

  const mapCenter = currentPosition && task
    ? {
        lat: (currentPosition.lat + task.destination_lat) / 2,
        lng: (currentPosition.lng + task.destination_lng) / 2,
      }
    : task
    ? { lat: task.destination_lat, lng: task.destination_lng }
    : { lat: 35.6762, lng: 139.6503 };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">戻る</span>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span className="text-sm font-medium">削除</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {task.destination_name}
          </h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{new Date(task.target_date_time).toLocaleString('ja-JP')}</span>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <CountdownTimer targetDateTime={task.target_date_time} />

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={mapCenter}
                zoom={14}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
              >
                {task && (
                  <>
                    <Marker
                      position={{ lat: task.destination_lat, lng: task.destination_lng }}
                      icon={{
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: '#ef4444',
                        fillOpacity: 1,
                        strokeColor: '#ffffff',
                        strokeWeight: 2,
                      }}
                    />
                    <Circle
                      center={{ lat: task.destination_lat, lng: task.destination_lng }}
                      radius={CHECK_IN_RADIUS}
                      options={{
                        fillColor: '#22c55e',
                        fillOpacity: 0.2,
                        strokeColor: '#22c55e',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                      }}
                    />
                  </>
                )}

                {currentPosition && (
                  <Marker
                    position={currentPosition}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      scale: 8,
                      fillColor: '#3b82f6',
                      fillOpacity: 1,
                      strokeColor: '#ffffff',
                      strokeWeight: 2,
                    }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-100">
                <div className="text-gray-500">地図を読み込み中...</div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Navigation className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">GPS状態</span>
              </div>
              <div>
                {gpsStatus === 'loading' && (
                  <span className="text-sm text-gray-500">GPS信号を受信中...</span>
                )}
                {gpsStatus === 'success' && (
                  <span className="text-sm text-green-600 font-medium">位置情報を取得しました</span>
                )}
                {gpsStatus === 'error' && (
                  <span className="text-sm text-red-600 font-medium">位置情報の取得に失敗しました</span>
                )}
              </div>
            </div>

            {distance !== null && distanceStatus && (
              <div className="text-center py-6">
                <div className="text-sm text-gray-600 mb-2">目的地まで</div>
                <div className={`text-5xl font-bold ${distanceStatus.color} mb-2`}>
                  {formatDistance(distance)}
                </div>
                <div className={`text-lg font-semibold ${distanceStatus.color}`}>
                  {distanceStatus.message}
                </div>
              </div>
            )}

            {gpsStatus === 'error' && (
              <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-red-900 mb-1">
                    位置情報の許可が必要です
                  </h3>
                  <p className="text-sm text-red-700">
                    ブラウザの設定から位置情報の使用を許可してください。
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleCheckIn}
              disabled={!distanceStatus?.canCheckIn || isCheckingIn || gpsStatus !== 'success'}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
                distanceStatus?.canCheckIn && gpsStatus === 'success'
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isCheckingIn
                ? 'チェックイン中...'
                : distanceStatus?.canCheckIn
                ? '到着！ペナルティを回避する'
                : '目的地に近づいてください'}
            </button>
          </div>
        </div>
      </div>

      {showSuccessModal && <SuccessModal onClose={handleSuccessModalClose} />}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">タスクを削除しますか？</h2>
            </div>
            <p className="text-gray-600 mb-6">
              この操作は取り消せません。本当にこのタスクを削除してもよろしいですか？
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? '削除中...' : '削除する'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
