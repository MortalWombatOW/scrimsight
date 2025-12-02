import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string; // Allow optional additional classes
}

const Container: React.FC<ContainerProps> = ({ children, className = "" }) => {
  return (
    // Use theme background, border, and shadow
    <div
      className={`p-4 rounded-lg bg-base-200 shadow-md ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
