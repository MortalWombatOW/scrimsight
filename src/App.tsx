import { Location } from 'history';
import React, { useRef } from 'react';
import { BrowserRouter, data, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import routes, { ScrimsightRoute } from './lib/routes';
import { themeDef } from './theme';

import { WombatDataProvider, DataManager, AlaSQLNode, AlaSQLNodeConfig, FunctionNode, FunctionNodeConfig, IndexedDBNode, IndexedDBNodeConfig, ObjectStoreNode, ObjectStoreNodeConfig, LogLevel, InputNodeConfig, InputNode } from 'wombat-data-framework';
import Header from './components/Header/Header';
import { getColorgorical } from './lib/color';
import { generateThemeColor } from './lib/palette';
import { useDeepMemo } from './hooks/useDeepEffect';
import { DATA_COLUMNS, OBJECT_STORE_NODES, ALASQL_NODES, FUNCTION_NODES, FILE_PARSING_NODES, indexedDbNode } from './WombatDataFrameworkSchema';

const ContextualizedRoute = ({ route }: { route: ScrimsightRoute }): JSX.Element => {
  let el: JSX.Element = React.createElement(route.component, {});
  for (const context of route.contexts || []) {
    el = React.createElement(context, undefined, el);
  }
  console.log('el', el);
  return el;
};

function ThemedRoutes(props) {
  const theme = createTheme({
    ...themeDef,
    palette: {
      ...themeDef.palette,
      team1: generateThemeColor(getColorgorical('Team 1')),
      team2: generateThemeColor(getColorgorical('Team 2')),
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Routes>{routes.map((route) => route.path.map((path, i) => <Route key={path} path={path} index={(i === (0 as unknown)) as false} element={<ContextualizedRoute route={route} />} />))}</Routes>
    </ThemeProvider>
  );
}

const initializeDataManager = (dataManager: DataManager) => {
  console.log('Initializing Data Manager');
  DATA_COLUMNS.forEach((col) => dataManager.registerColumn(col));

  const allNodes = [indexedDbNode, ...FILE_PARSING_NODES, ...OBJECT_STORE_NODES, ...ALASQL_NODES, ...FUNCTION_NODES];
  allNodes.forEach((node) => {
    if (node.type === 'IndexedDBNode') {
      const requiredObjectStores = allNodes.filter((n) => n.type === 'ObjectStoreNode').map((n) => (n as ObjectStoreNodeConfig).objectStore);
      const configWithObjectStores: IndexedDBNodeConfig = { ...node as IndexedDBNodeConfig, objectStores: requiredObjectStores };
      dataManager.registerNode(new IndexedDBNode(configWithObjectStores));
    }
    const nodeColumns = node.columnNames.map((name) => dataManager.getColumnOrDie(name));
    if (node.type === 'InputNode') {
      const inputNode = node as InputNodeConfig;
      dataManager.registerNode(new InputNode(inputNode.name, inputNode.displayName, inputNode.outputType, nodeColumns, inputNode.behavior));
    }
    if (node.type === 'ObjectStoreNode') {
      const objectStoreNode = node as ObjectStoreNodeConfig;
      dataManager.registerNode(new ObjectStoreNode(objectStoreNode.name, objectStoreNode.displayName, nodeColumns, objectStoreNode.objectStore, objectStoreNode.source, objectStoreNode.behavior));
    }
    if (node.type === 'AlaSQLNode') {
      const alaSQLNode = node as AlaSQLNodeConfig;
      dataManager.registerNode(new AlaSQLNode(alaSQLNode.name, alaSQLNode.displayName, alaSQLNode.sql, alaSQLNode.sources, nodeColumns));
    }
    if (node.type === 'FunctionNode') {
      const functionNode = node as FunctionNodeConfig;
      dataManager.registerNode(new FunctionNode(functionNode.name, functionNode.displayName, functionNode.transform, functionNode.sources, nodeColumns, functionNode.outputType));
    }
  });
};

const App = () => {
  const [tick, setTick] = React.useState(0);
  const incrementTick = () => {
    setTick((tick) => {
      return tick + 1;
    });
  };

  console.log('Rendering App', tick);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <WombatDataProvider changeCallback={incrementTick} logLevel={LogLevel.Debug} initializeDataManager={initializeDataManager}>
        <BrowserRouter basename="/">
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <ThemedRoutes />
          </QueryParamProvider>
        </BrowserRouter>
      </WombatDataProvider>
    </div>
  );
};

const RouteAdapter: React.FC = ({ children }: { children }) => {
  const reactRouterNavigate = useNavigate();
  const reactRouterlocation = useLocation();

  const adaptedHistory = useDeepMemo(
    () => ({
      // can disable eslint for parts here, location.state can be anything
      replace(location: Location) {
        reactRouterNavigate(location, { replace: true, state: location.state });
      },
      push(location: Location) {
        reactRouterNavigate(location, {
          replace: false,

          state: location.state,
        });
      },
    }),
    [reactRouterNavigate],
  );
  // https://github.com/pbeshai/use-query-params/issues/196
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  return children({
    history: adaptedHistory,
    location: reactRouterlocation,
  });
};

export default App;
