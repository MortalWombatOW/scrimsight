import { useLoadSampleData } from "../lib/useLoadSampleData";

const SampleData = ({ children }: { children: React.ReactNode }) => {
  console.log("SampleData component mounted");
  useLoadSampleData(true);
  return <>{children}</>;
};

export default SampleData;
