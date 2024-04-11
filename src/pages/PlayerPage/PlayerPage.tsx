import React, {useEffect} from 'react';
import {StringParam, useQueryParam} from 'use-query-params';
import Header from './../../components/Header/Header';
import usePlayerInfo from './hooks/usePlayerInfo';
import {usePlayerContext} from './context/PlayerContext';
import {Box, Container, Paper, Typography} from '@mui/material';
import {useParams} from 'react-router-dom';
import {formatTime} from '../../lib/format';
import {heroNameToNormalized} from '../../lib/string';
import {getHeroImage} from '../../lib/data/data';
import IconAndText from '../../components/Common/IconAndText';
import {ColorKey} from '../../theme';

function HeroTimeBarChart(props) {
  const width = 500;
  const maxTimePlayed = props.info?.heroes.reduce(
    (acc: number, cur: any) => Math.max(acc, cur.timePlayed),
    0,
  );
  const timePlayedToWidth = (timePlayed: number) => {
    return Math.floor((timePlayed / maxTimePlayed) * width);
  };

  const top5Heroes: {
    hero: string;
    timePlayed: number;
  }[] = Array.from(props.info?.heroes || []);
  top5Heroes.sort((a, b) => b.timePlayed - a.timePlayed);
  const otherTime = top5Heroes
    .slice(5)
    .reduce((acc, cur) => acc + cur.timePlayed, 0);
  top5Heroes.splice(5);
  return (
    <Box
      component="div"
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      {top5Heroes.map((h) => (
        <Box
          key={h.hero}
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
          component="div">
          <IconAndText
            variant="contained"
            icon={<img src={getHeroImage(h.hero)} style={{width: '24px'}} />}
            text={h.hero}
            dynamic
            colorKey={heroNameToNormalized(h.hero) as ColorKey}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onClick={() => {}}
          />
          <Typography
            variant="body2"
            sx={{
              backgroundColor: `${heroNameToNormalized(h.hero)}.main`,
              color: `${heroNameToNormalized(h.hero)}.contrastText`,
              // only right side border radius
              marginTop: '8px',
              borderRadius: '0px 10px 10px 0px',
              height: '20px',
              width: `${timePlayedToWidth(h.timePlayed)}px`,
            }}></Typography>
          <Typography
            variant="body1"
            sx={{marginLeft: '10px', marginTop: '4px'}}>
            {formatTime(h.timePlayed)}
          </Typography>
        </Box>
      ))}
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
        component="div">
        <Typography
          variant="body1"
          sx={{
            width: '200px',
          }}>
          Other - {formatTime(otherTime)} played
        </Typography>
        <Typography
          variant="body2"
          sx={{
            backgroundColor: 'grey',
            color: 'black',
            borderRadius: '10px',
            height: '20px',
            width: `${timePlayedToWidth(otherTime)}px`,
          }}></Typography>
      </Box>
    </Box>
  );
}

const PlayerPage = () => {
  // const [totals, running, refresh] = useQuery(
  //   `
  //   select player, \`target\`,
  //   sum(CASE WHEN type = "damage" THEN amount ELSE 0 END) as damage,
  //   sum(CASE WHEN type = "healing" THEN amount ELSE 0 END) as healing,
  //   sum(CASE WHEN type = "elimination" THEN 1 ELSE 0 END) as eliminations,
  //   sum(CASE WHEN type = "final blow" THEN 1 ELSE 0 END) as final_blows
  //   from player_interaction
  //   group by player_interaction.player,  player_interaction.\`target\` order by damage desc
  //   `,
  // );

  // const [timeData, running2, refresh2] = useQuery(
  //   `
  //   select player, mapId, timestamp, sum(CASE WHEN type = "damage" THEN amount ELSE 0 END) as damage,
  //   sum(CASE WHEN type = "healing" THEN amount ELSE 0 END) as healing
  //   from player_interaction
  //   group by player_interaction.player,  player_interaction.mapId, player_interaction.timestamp order by damage desc
  //   `,
  // );

  // const [heroData, running3, refresh3] = useQuery(
  //   `
  //   select player, hero, count(*) as hero_time, rownum() as hero_rank
  //   from player_status
  //   group by player_status.player, player_status.hero
  //   having hero_rank <= 3
  //   `,
  // );

  // console.log('heroData', heroData);

  const params = useParams<{playerName: string}>();
  const playerNameParam = params.playerName;

  const {playerName, setPlayerName} = usePlayerContext();

  useEffect(() => {
    console.log('playerNameParam', playerNameParam);
    if (playerNameParam) {
      setPlayerName(playerNameParam);
    }
  }, [playerNameParam]);

  const info: {
    name: string;
    teams: string[];
    timePlayed: number;
    heroes: {
      hero: string;
      timePlayed: number;
    }[];
    mapsPlayed: number[];
  } | null = usePlayerInfo();

  console.log('info', info);

  return (
    <div>
      <Header />
      <Container maxWidth="xl">
        <Paper style={{padding: '1em'}}>
          <Typography variant="h6">Player Info</Typography>
          <Typography variant="h4">{playerName}</Typography>
          <Typography variant="body1">
            {formatTime(info?.timePlayed)} played
          </Typography>
          <HeroTimeBarChart info={info}></HeroTimeBarChart>
        </Paper>
      </Container>
    </div>
  );
};

export default PlayerPage;
