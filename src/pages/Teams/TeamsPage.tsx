import { useAtom } from 'jotai';
import { teamNamesAtom } from '../../atoms';
import TeamCard from '../../components/TeamCard';

export const TeamsPage = () => {
  const [teamNames] = useAtom(teamNamesAtom);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {teamNames.map(team => (
        <TeamCard
          key={team}
          teamName={team}
        />
      ))}
    </div>
  );
};

