export interface PlaceLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface TaskFormData {
  destination: PlaceLocation | null;
  targetDateTime: Date | null;
  penaltyAmount: number;
  agreedToTerms: boolean;
}

export interface Task {
  id: string;
  user_id: string;
  destination_name: string;
  destination_address: string;
  destination_lat: number;
  destination_lng: number;
  target_date_time: string;
  penalty_amount: number;
  stripe_payment_method_id: string | null;
  stripe_payment_intent_id: string | null;
  gps_activation_time: string | null;
  status: 'pending' | 'active' | 'completed' | 'failed';
  created_at: string;
  completed_at: string | null;
  check_in_lat: number | null;
  check_in_lng: number | null;
  check_in_time: string | null;
}
