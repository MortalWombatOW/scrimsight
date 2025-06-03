import { atom } from "jotai";
import { type SampleDataEnabledType } from "@atoms"; // Ensure type is imported

// Default export the direct atom definition
export default atom<SampleDataEnabledType>(true);
