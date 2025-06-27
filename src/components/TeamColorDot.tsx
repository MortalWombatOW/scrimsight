import { getColorgorical } from "../lib/color";

interface TeamColorDotProps {
  teamName: string;
  size?: number;
}

const TeamColorDot = ({ teamName, size = 12 }: TeamColorDotProps) => {
  const backgroundColor = getColorgorical(teamName);

  return (
    <div
      className="rounded-full inline-block"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
      }}
    />
  );
};

export default TeamColorDot;
