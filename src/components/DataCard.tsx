
import React from 'react';

type DataCardProps = {
  width: number;
  height?: number;
  className?: string;
  background?: React.ReactNode;
  backgroundColor?: string;
  children: React.ReactNode;
};

const DataCard: React.FC<DataCardProps> = ({
  width,
  height = 120,
  className = '',
  background,
  backgroundColor,
  children,
}) => {
  return (
    <div
      data-testid="data-card"
      className={`relative rounded-lg overflow-hidden shadow-lg text-white flex flex-col items-center justify-end p-2 ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: backgroundColor || '#1f2937', // Default to gray-800
      }}
    >
      {background && (
        <div className="absolute inset-0">
          {background}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>
      )}
      <div className="z-10 text-center" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
        {children}
      </div>
    </div>
  );
};

export default DataCard;
