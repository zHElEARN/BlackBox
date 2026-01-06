import { create } from 'zustand';

interface FlightState {
  isFlying: boolean;
  takeoffTime: number | null;
  startFlight: () => void;
  endFlight: () => void;
}

export const useFlightStore = create<FlightState>((set) => ({
  isFlying: false,
  takeoffTime: null,
  startFlight: () => set({ isFlying: true, takeoffTime: Date.now() }),
  endFlight: () => set({ isFlying: false, takeoffTime: null }),
}));
