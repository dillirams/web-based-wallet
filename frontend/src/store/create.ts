import { create } from "zustand";

interface WalletType {
  mnuemonics: string | null;
  setMnuemonics: (m: string) => void;
  seed: any | null;
  setSeed: (s:any) => void;
}

export const useWalletStore = create<WalletType>((set) => ({
  mnuemonics: null,
  setMnuemonics: (mnuemonics) => set({ mnuemonics }),
  seed: null,
  setSeed: (seed) => set({ seed }),
}));
