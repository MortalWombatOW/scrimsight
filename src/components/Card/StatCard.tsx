import { Card, CardContent, Typography } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string;
  color: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <Card sx={{ width: 'fit-content', height: 'fit-content', borderColor: color, borderWidth: 1, borderStyle: 'solid' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h2" sx={{ color }}>
          {value}
        </Typography>
        <Typography variant="h6" sx={{ color }}>{title}</Typography>
      </CardContent>
    </Card>
  );
};
