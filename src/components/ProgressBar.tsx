interface ProgressBarProps {
  value: number;
  maxValue?: number;
  height?: string;
  className?: string;
  reverse?: boolean;
}

export const ProgressBar = ({
  value,
  maxValue = 100,
  height = "h-2",
  className = "",
  reverse = false,
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));

  return (
    <div
      className={`w-full bg-base-200 dark:bg-base-700 rounded-sm overflow-hidden ${height} ${className}`}
    >
      <div
        className="h-full"
        style={{
          width: `${percentage}%`,
          backgroundColor: "var(--color-base-content)",
          [reverse ? "marginLeft" : "marginRight"]: "auto",
        }}
      />
    </div>
  );
};
