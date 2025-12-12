import React from 'react';
import { GoogleMap, Marker, Circle, useJsApiLoader } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';
import { PlaceLocation } from '../../types/task';

interface DestinationSectionProps {
  destination: PlaceLocation | null;
  onDestinationChange: (destination: PlaceLocation | null) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '250px',
};

const RADIUS = 100;
const libraries: ('places')[] = ['places'];

export const DestinationSection: React.FC<DestinationSectionProps> = ({
  destination,
  onDestinationChange,
}) => {
  const [searchInput, setSearchInput] = React.useState('');
  const autocompleteRef = React.useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  React.useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'jp' },
        fields: ['name', 'formatted_address', 'geometry'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();

        if (place?.geometry?.location) {
          const location: PlaceLocation = {
            name: place.name || '',
            address: place.formatted_address || '',
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          onDestinationChange(location);
          setSearchInput(location.name);
        }
      });
    }
  }, [isLoaded, onDestinationChange]);

  if (!isLoaded) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-slate-900">目的地設定</h2>
        </div>
        <p className="text-slate-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-slate-900">目的地設定</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            目的地を検索
          </label>
          <input
            ref={inputRef}
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="場所の名前や住所を入力してください"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
        </div>

        {destination && (
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <p className="font-semibold text-slate-900 text-lg">{destination.name}</p>
              <p className="text-sm text-slate-600 mt-1">{destination.address}</p>
            </div>

            <div className="rounded-lg overflow-hidden border-2 border-slate-300">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{ lat: destination.lat, lng: destination.lng }}
                zoom={16}
                options={{
                  disableDefaultUI: true,
                  zoomControl: true,
                }}
              >
                <Marker position={{ lat: destination.lat, lng: destination.lng }} />
                <Circle
                  center={{ lat: destination.lat, lng: destination.lng }}
                  radius={RADIUS}
                  options={{
                    fillColor: '#3B82F6',
                    fillOpacity: 0.2,
                    strokeColor: '#3B82F6',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                />
              </GoogleMap>
            </div>

            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">チェックイン可能範囲:</span> この範囲内（半径{RADIUS}m）でチェックイン可能です（GPS誤差を考慮）
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
