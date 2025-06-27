import { ReactNode } from "react";

interface ComputedTextProps {
  children: ReactNode;
}

const ComputedText = ({ children }: ComputedTextProps) => {
  return (
    <span
      className={`rounded p-1 m-1 border-1 border-info bg-info/20 text-info-content`}
    >
      {children}
    </span>
  );
};

export default ComputedText;
