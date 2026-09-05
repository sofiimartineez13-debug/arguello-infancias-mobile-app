import { create } from 'zustand';

type ResidentState = {
  /** NNA seleccionado para consultar su detalle / registrar sobre él. */
  selectedResidentId: string | null;
  setSelectedResident: (id: string | null) => void;
};

export const useResidentStore = create<ResidentState>((set) => ({
  selectedResidentId: null,
  setSelectedResident: (id) => set({ selectedResidentId: id }),
}));
