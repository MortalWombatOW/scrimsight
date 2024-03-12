import React from 'react';

interface MapContextState {
  mapId?: number;
  roundId?: number;
  timeWindow?: [number, number];
}

type MapContextAction =
  | {type: 'setMapId'; mapId: number}
  | {type: 'setRoundId'; roundId: number}
  | {type: 'setTimeWindow'; timeWindow: [number, number]};

const MapContext = React.createContext<{
  state: MapContextState;
  dispatch: React.Dispatch<MapContextAction>;
}>({
  state: {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {},
});

const mapContextReducer = (
  state: MapContextState,
  action: MapContextAction,
) => {
  switch (action.type) {
    case 'setMapId':
      return {...state, mapId: action.mapId};
    case 'setRoundId':
      return {...state, roundId: action.roundId};
    case 'setTimeWindow':
      return {...state, timeWindow: action.timeWindow};
    default:
      return state;
  }
};

export const MapContextProvider = ({children}: {children: React.ReactNode}) => {
  const [state, dispatch] = React.useReducer(mapContextReducer, {});
  const value = {state, dispatch};
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMapContext = () => {
  const context = React.useContext(MapContext);

  const setMapId = (mapId: number) => {
    context.dispatch({type: 'setMapId', mapId});
  };

  const setRoundId = (roundId: number) => {
    context.dispatch({type: 'setRoundId', roundId});
  };

  const setTimeWindow = (timeWindow: [number, number]) => {
    context.dispatch({type: 'setTimeWindow', timeWindow});
  };

  return {
    ...context.state,
    setMapId,
    setRoundId,
    setTimeWindow,
  };
};
