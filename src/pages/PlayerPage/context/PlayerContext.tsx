import React from 'react';
interface PlayerContextState {
  playerName?: string;
}

type PlayerContextAction = {type: 'setPlayerName'; playerName: string};

const PlayerContext = React.createContext<{
  state: PlayerContextState;
  dispatch: React.Dispatch<PlayerContextAction>;
}>({
  state: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
});

const playerContextReducer = (
  state: PlayerContextState,
  action: PlayerContextAction,
) => {
  switch (action.type) {
    case 'setPlayerName':
      return {...state, playerName: action.playerName};
    default:
      return state;
  }
};

export const PlayerContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(playerContextReducer, {});
  const value = {state, dispatch};
  return (
    <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
  );
};

export const usePlayerContext = () => {
  const context = React.useContext(PlayerContext);

  const setPlayerName = (playerName: string) => {
    context.dispatch({type: 'setPlayerName', playerName});
  };

  return {
    ...context.state,
    setPlayerName,
  };
};
