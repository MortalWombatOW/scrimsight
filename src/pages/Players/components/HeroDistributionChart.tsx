import { Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

export const HeroDistributionChart = () => {
  // For now, we'll use mock data since we need to implement hero tracking
  // This should be replaced with actual hero play time data
  const mockData = [
    { id: 0, value: 35, label: 'Tank' },
    { id: 1, value: 40, label: 'DPS' },
    { id: 2, value: 25, label: 'Support' },
  ];

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <PieChart
        series={[
          {
            data: mockData,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30 },
          },
        ]}
        height={300}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 0,
          },
        }}
      />
    </Box>
  );
}; 
