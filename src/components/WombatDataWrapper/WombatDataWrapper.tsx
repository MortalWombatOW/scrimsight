import React from 'react';
import { WombatDataProvider, LogLevel } from 'wombat-data-framework';
import { initializeDataManager } from '../../WombatDataFrameworkSchema';


interface WombatDataWrapperProps {
  children: React.ReactNode;
}

const WombatDataWrapper: React.FC<WombatDataWrapperProps> = ({ children }) => {
  const [_, setTick] = React.useState(0);
  const incrementTick = () => {
    setTick((tick) => tick + 1);
  };

  // const [searchParams] = useSearchParams();
  // const logLevelString = searchParams.get('debug');
  // const logLevel = logLevelString === 'timing' ? LogLevel.Timing : logLevelString === 'warn' ? LogLevel.Warn : logLevelString === 'info' ? LogLevel.Info : logLevelString === 'debug' ? LogLevel.Debug : LogLevel.Error;

  // const maxTicksString = searchParams.get('maxTicks');
  // const maxTicks = maxTicksString ? parseInt(maxTicksString) : undefined;

  // console.log('Rendering WombatDataWrapper', tick);

  const logLevel = LogLevel.Debug;
  const maxTicks = undefined;

  return (
    <WombatDataProvider changeCallback={incrementTick} logLevel={logLevel} maxTicks={maxTicks} initializeDataManager={initializeDataManager}>
      {children}
    </WombatDataProvider>
  );
};

export default WombatDataWrapper;
