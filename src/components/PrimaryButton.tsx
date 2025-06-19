import { ReactNode } from 'react';

interface PrimaryButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const PrimaryButton = ({ children, onClick, disabled }: PrimaryButtonProps) => {
  return (
    <button
      className="btn btn-primary w-full sm:w-auto"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;