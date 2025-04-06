import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string; // Allow optional additional classes
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`p-4 rounded-lg border border-gray-500 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
