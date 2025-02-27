interface StatCardProps {
  title: string;
  value: string;
  color: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  color,
  icon,
}) => {
  return (
    <div
      className="w-full h-full border rounded-md p-4 transition-transform duration-200 hover:-translate-y-1"
      style={{ borderColor: color }}
    >
      <div className="flex items-center mb-2">
        {icon && (
          <div className="flex items-center mr-2" style={{ color }}>
            {icon}
          </div>
        )}
        <p className="text-sm font-medium text-gray-500">{title}</p>
      </div>
      <p className="text-2xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
};
