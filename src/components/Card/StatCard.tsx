import { Card, CardContent, Typography, Box } from "@mui/material";

interface StatCardProps {
  title: string;
  value: string;
  color: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, color, icon }) => {
  return (
    <Card sx={{ 
      width: '100%', 
      height: '100%', 
      borderColor: color, 
      borderWidth: 1, 
      borderStyle: 'solid',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon && (
            <Box sx={{ color, mr: 1, display: 'flex', alignItems: 'center' }}>
              {icon}
            </Box>
          )}
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ color }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};
