import type { Meta, StoryObj } from "@storybook/react-vite";
import { Provider } from "jotai";
import { dataModelAtom } from "../atoms/scrimsight";
import { MatchCard } from "./MatchCard";
import { ScrimsightDataModel } from "../lib/ScrimsightDataModel";

const meta: Meta<typeof MatchCard> = {
  title: "Components/MatchCard",
  component: MatchCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story, { args }) => {
      const hydratedAtom = dataModelAtom;
      hydratedAtom.init = mockDataModel;
      
      return (
        <Provider>
          <div className="w-80">
            <Story {...args} />
          </div>
        </Provider>
      );
    },
  ],
  argTypes: {
    matchId: {
      control: "text",
      description: "The ID of the match to display",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockDataModel: ScrimsightDataModel = {
  matches: [
    {
      match: "match-1",
      scrim: "scrim-1",
      teams: ["Atlanta Reign", "Boston Uprising"] as [string, string],
      map: "King's Row",
      date: new Date("2024-01-15T14:30:00"),
      rounds: [1, 2, 3],
      duration: 720,
      team1Score: 3,
      team2Score: 1,
      winningTeam: "Atlanta Reign",
      gameMode: "Hybrid",
    },
    {
      match: "match-2", 
      scrim: "scrim-1",
      teams: ["Dallas Fuel", "Houston Outlaws"] as [string, string],
      map: "Ilios",
      date: new Date("2024-01-15T15:45:00"),
      duration: 540,
      team1Score: 1,
      team2Score: 2,
      winningTeam: "Houston Outlaws",
      gameMode: "Control",
    },
    {
      match: "match-3",
      scrim: "scrim-2", 
      teams: ["Florida Mayhem", "New York Excelsior"] as [string, string],
      map: "Dorado",
      date: new Date("2024-01-16T16:00:00"),
      duration: 660,
      team1Score: 2,
      team2Score: 2,
      winningTeam: "",
      gameMode: "Escort",
    },
  ],
  scrims: [],
  teams: [],
  players: [],
  ability1Used: [],
  ability2Used: [],
  damage: [],
  defensiveAssist: [],
  dvaDemech: [],
  dvaRemech: [],
  healing: [],
  heroSpawn: [],
  heroSwap: [],
  kill: [],
  matchEnd: [],
  matchStart: [],
  mercyRez: [],
  offensiveAssist: [],
  playerStat: [],
  roundEnd: [],
  roundStart: [],
  setupComplete: [],
  ultimateCharged: [],
  ultimateEnd: [],
  ultimateStart: [],
};

export const TeamOneWins: Story = {
  args: {
    matchId: "match-1",
  },
};

export const TeamTwoWins: Story = {
  args: {
    matchId: "match-2",
  },
};

export const Draw: Story = {
  args: {
    matchId: "match-3",
  },
};

export const NotFound: Story = {
  args: {
    matchId: "non-existent-match",
  },
};