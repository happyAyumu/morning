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
