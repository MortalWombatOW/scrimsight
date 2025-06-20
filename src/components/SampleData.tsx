import { useLoadSampleData } from "../lib/useLoadSampleData";

const SampleData = ({ children }: { children: React.ReactNode }) => {
  useLoadSampleData(true);
  return <>{children}</>;
};

export default SampleData;
