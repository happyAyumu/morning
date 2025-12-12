import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type User = {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
};

export type Task = {
  id: string;
  userId: string;
  destinationName: string;
  destinationAddress: string;
  destinationLat: number;
  destinationLng: number;
  targetDateTime: Date;
  penaltyAmount: number;
  stripePaymentMethodId: string | null;
  stripePaymentIntentId: string | null;
  gpsActivationTime: Date | null;
  status: 'pending' | 'active' | 'completed' | 'failed';
  createdAt: Date;
  completedAt: Date | null;
};
