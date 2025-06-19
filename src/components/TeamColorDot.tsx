interface TeamColorDotProps {
  teamName: string;
  size?: number;
}

const TeamColorDot = ({ teamName, size = 12 }: TeamColorDotProps) => {
  const generateColorFromTeamName = (name: string): string => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash) % 360;
    const saturation = 65 + (Math.abs(hash >> 8) % 20);
    const lightness = 50 + (Math.abs(hash >> 16) % 15);
    
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  const backgroundColor = generateColorFromTeamName(teamName);

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