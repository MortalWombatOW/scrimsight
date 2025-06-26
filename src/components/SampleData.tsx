import { useLoadSampleData } from "../hooks/useLoadSampleData";

const SampleData = ({ children }: { children: React.ReactNode }) => {
  console.log("SampleData component mounted");
  useLoadSampleData(true);
  return <>{children}</>;
};

export default SampleData;
