import {useReducer} from 'react';
import {createContainer} from 'react-tracked';
import {GlobalState} from './data/types';

const initialGlobalState: GlobalState = {
  filesToUpload: [],
  loadedFiles: [],
  parsedFiles: [],
  uploadSuccesses: [],
  uploadErrors: [],
};

let GlobalStateProvider;
let useGlobalState: () => [
  GlobalState,
  (newState: Partial<GlobalState>) => void,
] = () => {
  console.error('GlobalStateProvider not set up');
  return [
    initialGlobalState,
    (newState: Partial<GlobalState>) => {
      console.error(`GlobalStateProvider not set up - ${newState}`);
    },
  ];
};

const useValue = () =>
  useReducer(
    (state: GlobalState, newState: Partial<GlobalState>) => ({
      ...state,
      ...newState,
    }),
    initialGlobalState,
  );

const setupGlobalState = () => {
  const {Provider, useTracked} = createContainer(useValue);
  GlobalStateProvider = Provider;
  useGlobalState = useTracked;
};

export {setupGlobalState, GlobalStateProvider, useGlobalState};
