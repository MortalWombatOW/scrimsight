import { ReactNode } from "react";

const ComputedData = ({ children }: { children: ReactNode }) => {
  return (
    <div className="border-1 rounded border-info bg-info/5 p-2">{children}</div>
  );
};

export default ComputedData;
