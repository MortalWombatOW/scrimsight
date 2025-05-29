import { atom } from "jotai";
import { SampleDataEnabledType } from "@atoms";

const sampleDataEnabledAtom = atom<SampleDataEnabledType>(true);
export default sampleDataEnabledAtom;
