import { useAtomValue } from "jotai";
import { dataModelAtom } from "@atoms/scrimsight";

export const useScrimsightData = () => {
  const dataModel = useAtomValue(dataModelAtom);
  if (!dataModel) {
    throw new Error("Scrimsight data not loaded, this hook should only be used in components that are rendered after the data is loaded");
  }
  return dataModel;
};