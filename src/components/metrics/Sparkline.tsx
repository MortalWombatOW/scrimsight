interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  benchmarkLine?: number;
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  color = '#3b82f6',
  benchmarkLine,
}: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const scaleX = (i: number) =>
    padding + (i / (data.length - 1)) * (width - padding * 2);
  const scaleY = (v: number) =>
    height - padding - ((v - min) / range) * (height - padding * 2);

  const points = data.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' ');

  // Fill area below the line
  const fillPoints = [
    `${scaleX(0)},${height - padding}`,
    ...data.map((v, i) => `${scaleX(i)},${scaleY(v)}`),
    `${scaleX(data.length - 1)},${height - padding}`,
  ].join(' ');

  const benchmarkY =
    benchmarkLine !== undefined ? scaleY(benchmarkLine) : undefined;

  return (
    <svg width={width} height={height} className="block">
      {/* Fill */}
      <polygon points={fillPoints} fill={color} opacity={0.1} />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Benchmark reference */}
      {benchmarkY !== undefined && (
        <line
          x1={padding}
          y1={benchmarkY}
          x2={width - padding}
          y2={benchmarkY}
          stroke={color}
          strokeWidth={0.5}
          strokeDasharray="3,3"
          opacity={0.4}
        />
      )}
      {/* End dot */}
      <circle
        cx={scaleX(data.length - 1)}
        cy={scaleY(data[data.length - 1])}
        r={2}
        fill={color}
      />
    </svg>
  );
}
