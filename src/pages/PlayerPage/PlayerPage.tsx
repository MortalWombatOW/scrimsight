import React, {useEffect} from 'react';
import {StringParam, useQueryParam} from 'use-query-params';
import Header from './../../components/Header/Header';
import './PlayerPage.scss';

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

  const [selectedPlayer, setSelectedPlayer] = useQueryParam('p', StringParam);

  return (
    <div>
      <Header />
      <div className="Playerpage-container"></div>
    </div>
  );
};

export default PlayerPage;
