import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { getRoute } from '../lib/route';

type AbsoluteRoute = '/' | '/callback' | '/demo' | '/app';

type AppSubRouteStatic = '/scrims' | '/matches' | '/players' | '/teams' | '/settings';

type AppSubRouteParameterized = 
  | '/scrim/:scrimId'
  | '/match/:matchId' 
  | '/player/:playerName'
  | '/team/:teamName';

type AppSubRoute = AppSubRouteStatic | AppSubRouteParameterized;

type ScrimsightRoute = AbsoluteRoute | AppSubRoute;

type RouteParameters<T extends ScrimsightRoute> = 
  T extends '/scrim/:scrimId' ? { scrimId: string } :
  T extends '/match/:matchId' ? { matchId: string } :
  T extends '/player/:playerName' ? { playerName: string } :
  T extends '/team/:teamName' ? { teamName: string } :
  undefined;

type NavigationFunction = {
  <TRoute extends ScrimsightRoute>(
    route: TRoute, 
    ...params: RouteParameters<TRoute> extends undefined 
      ? [] 
      : [RouteParameters<TRoute>]
  ): void;
}

const ABSOLUTE_ROUTES: AbsoluteRoute[] = ['/', '/callback', '/demo', '/app'];

const APP_SUB_ROUTES_STATIC: AppSubRouteStatic[] = ['/scrims', '/matches', '/players', '/teams', '/settings'];

const APP_SUB_ROUTES_PARAMETERIZED: AppSubRouteParameterized[] = [
  '/scrim/:scrimId',
  '/match/:matchId', 
  '/player/:playerName',
  '/team/:teamName'
];

const ALL_ROUTES = [...ABSOLUTE_ROUTES, ...APP_SUB_ROUTES_STATIC, ...APP_SUB_ROUTES_PARAMETERIZED];

const isAbsoluteRoute = (route: string): route is AbsoluteRoute => {
  return ABSOLUTE_ROUTES.includes(route as AbsoluteRoute);
};

const isAppSubRouteStatic = (route: string): route is AppSubRouteStatic => {
  return APP_SUB_ROUTES_STATIC.includes(route as AppSubRouteStatic);
};

const isAppSubRouteParameterized = (route: string): route is AppSubRouteParameterized => {
  return APP_SUB_ROUTES_PARAMETERIZED.includes(route as AppSubRouteParameterized);
};

const isValidRoute = (route: string): route is ScrimsightRoute => {
  return ALL_ROUTES.includes(route as ScrimsightRoute);
};

const extractParameterNames = (route: string): string[] => {
  const matches = route.match(/:(\w+)/g);
  return matches ? matches.map(match => match.slice(1)) : [];
};

const substituteParameters = (route: string, params: Record<string, string>): string => {
  let result = route;
  for (const [key, value] of Object.entries(params)) {
    result = result.replace(`:${key}`, value);
  }
  return result;
};

const validateParameters = (route: string, params?: Record<string, unknown>): void => {
  const parameterNames = extractParameterNames(route);
  const providedParams = params || {};
  const providedParamKeys = Object.keys(providedParams);

  // Check for missing parameters
  for (const paramName of parameterNames) {
    if (!(paramName in providedParams)) {
      throw new Error(`Missing parameter: ${paramName}`);
    }
  }

  // Check for extra parameters
  for (const providedParamKey of providedParamKeys) {
    if (!parameterNames.includes(providedParamKey)) {
      throw new Error(`Unexpected parameters provided for route: ${route}`);
    }
  }

  // Check for parameters on routes that don't need them
  if (parameterNames.length === 0 && providedParamKeys.length > 0) {
    throw new Error(`Unexpected parameters provided for route: ${route}`);
  }
};

export const useScrimsightNavigation = () => {
  const navigate = useNavigate();

  const scrimsightNavigate: NavigationFunction = useCallback((route: ScrimsightRoute, params?: unknown) => {
    // Validate route
    if (!isValidRoute(route)) {
      throw new Error(`Invalid route: ${route}`);
    }

    // Validate parameters
    validateParameters(route, params as Record<string, unknown>);

    // Handle absolute routes - navigate directly
    if (isAbsoluteRoute(route)) {
      navigate(route);
      return;
    }

    // Handle app sub-routes
    let finalPath: string;

    if (isAppSubRouteStatic(route)) {
      // Static routes - use getRoute
      finalPath = getRoute(route);
    } else if (isAppSubRouteParameterized(route)) {
      // Parameterized routes - substitute parameters then use getRoute
      const substitutedPath = substituteParameters(route, params as Record<string, string>);
      finalPath = getRoute(substitutedPath);
    } else {
      throw new Error(`Invalid route: ${route}`);
    }

    navigate(finalPath);
  }, [navigate]);

  return { navigate: scrimsightNavigate };
};