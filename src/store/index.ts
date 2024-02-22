import { atom } from "recoil";
import { IInput } from "../components/Input";

export const inputStateAtom = atom<IInput>({
  key: "inputStateAtom",
  default: {
    value: "",
    isopen: false,
  },
});
