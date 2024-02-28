import { atom } from "recoil";

export interface IMapState {
  reset: boolean;
}

export const gisMapResetStateAtom = atom<IMapState>({
  key: "gisMapResetStateAtom",
  default: {
    reset: false,
  },
});
