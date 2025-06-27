const colorgorical = ['#78b4c6', '#fd6ca0', '#fd7450', '#7d9af7', '#2cc18e', '#eaa5c3', '#4ed31b', '#a3c541', '#c87ef8', '#fb57f9'];

export const getColorgorical = (str: string | null | undefined): string => {
  if (!str) {
    return 'white';
  }
  if (str === 'Team 1') {
    return colorgorical[0];
  }
  if (str === 'Team 2') {
    return colorgorical[1];
  }
  if (str === 'Draw') {
    return 'gray';
  }
  const index =
    Math.abs(
      str.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0),
    ) % colorgorical.length;
  return colorgorical[index];
};