import {create} from 'zustand';

interface FormState {
    isOpen: boolean
    toggle: (value: boolean) => void
  }
export const useFormGroup = create<FormState>((set) => ({
  // Définissez votre état initial ici
  isOpen: false,
  toggle: (value) => set((state) => ({ isOpen: value})),
}));

interface FormMatchState {
  isFormMatchOpen: boolean
  toggleForMatch: (value: boolean) => void
}
export const useFormMatch = create<FormMatchState>((set) => ({
// Définissez votre état initial ici
isFormMatchOpen: false,
toggleForMatch: (value) => set((state) => ({ isFormMatchOpen: value})),
}));
