import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { WombatDataProvider, LogLevel, DataManager } from 'wombat-data-framework';
import { initializeDataManager } from '../../services/dataManager';

interface WombatDataWrapperProps {
  children: React.ReactNode;
}

const WombatDataWrapper: React.FC<WombatDataWrapperProps> = ({ children }) => {
  const [tick, setTick] = React.useState(0);
  const incrementTick = () => {
    setTick((tick) => tick + 1);
  };

  const [searchParams] = useSearchParams();
  const logLevelString = searchParams.get('debug');
  const logLevel = logLevelString === 'timing' ? LogLevel.Timing :
    logLevelString === 'warn' ? LogLevel.Warn :
      logLevelString === 'info' ? LogLevel.Info :
        logLevelString === 'debug' ? LogLevel.Debug :
          LogLevel.Error;

  const maxTicksString = searchParams.get('maxTicks');
  const maxTicks = maxTicksString ? parseInt(maxTicksString) : undefined;

  console.log('Rendering WombatDataWrapper', tick);

  return (
    <WombatDataProvider
      changeCallback={incrementTick}
      logLevel={logLevel}
      maxTicks={maxTicks}
      initializeDataManager={initializeDataManager}
    >
      {children}
    </WombatDataProvider>
  );
};

export default WombatDataWrapper; 