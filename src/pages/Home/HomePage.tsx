import { Container, Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const HomePage = (): JSX.Element => {
  const modules = [
    {
      title: 'Files',
      description: 'Upload and manage scrim files for analysis.',
      route: '/files'
    },
    {
      title: 'Matches',
      description: 'View and analyze all the scrim matches.',
      route: '/matches'
    },
    {
      title: 'Teams',
      description: 'Review team statistics and player compositions.',
      route: '/teams'
    },
    {
      title: 'Players',
      description: 'Explore individual player stats and history.',
      route: '/players'
    }
  ];

  return (
    <div>
      <img src="/assets/fullpage/eqo.png" alt="Scrimsight" style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'cover' }} />
      <Container sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        marginTop: '-100px',
      }}>
        {modules.map((module) => (
          <Card key={module.title} sx={{ width: 275 }}>
            <CardContent>
              <Typography variant="h2" component="div">
                {module.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {module.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" component={Link} to={module.route}>
                Explore {module.title}
              </Button>
            </CardActions>
          </Card>
        ))}
      </Container>

    </div>
  );
};