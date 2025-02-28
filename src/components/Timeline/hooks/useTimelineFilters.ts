import { useState, useMemo, useEffect } from 'react';
import type { TimelineFilters } from './useTimelineData';
import type { MapTimes } from '../../../atoms/mapTimesAtom';

interface UseTimelineFiltersProps {
  mapTimes: MapTimes | undefined;
}

interface UseTimelineFiltersResult {
  filters: TimelineFilters;
  timeRangeStart: number;
  timeRangeEnd: number;
  setTimeRangeStart: (value: number) => void;
  setTimeRangeEnd: (value: number) => void;
  handleTimeRangeChange: (start: number, end: number) => void;
  resetFilters: () => void;
}

/**
 * Custom hook for managing timeline filters
 * Extracts filter logic from the Timeline component
 */
export function useTimelineFilters({ mapTimes }: UseTimelineFiltersProps): UseTimelineFiltersResult {
  // State for filter options
  const [timeRangeStart, setTimeRangeStart] = useState(0);
  const [timeRangeEnd, setTimeRangeEnd] = useState(0);
  const [players, setPlayers] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);

  // Initialize timeRange properly using useEffect to avoid render loop
  useEffect(() => {
    if (mapTimes) {
      setTimeRangeStart(0);
      setTimeRangeEnd(mapTimes.duration || 0);
    }
  }, [mapTimes]);

  // Memoize the time range filter object
  const timeRangeFilter = useMemo(
    () => ({ start: timeRangeStart, end: timeRangeEnd }),
    [timeRangeStart, timeRangeEnd]
  );

  // Memoize the complete filters object
  const filters = useMemo(
    () => ({
      players,
      teams,
      eventTypes,
      timeRange: timeRangeFilter,
    }),
    [players, teams, eventTypes, timeRangeFilter]
  );

  // Handle time range changes
  const handleTimeRangeChange = (start: number, end: number) => {
    if (start !== timeRangeStart) {
      setTimeRangeStart(start);
    }
    if (end !== timeRangeEnd) {
      setTimeRangeEnd(end);
    }
  };

  // Reset all filters to default values
  const resetFilters = () => {
    if (mapTimes) {
      setTimeRangeStart(0);
      setTimeRangeEnd(mapTimes.duration || 0);
    }
    setPlayers([]);
    setTeams([]);
    setEventTypes([]);
  };

  return {
    filters,
    timeRangeStart,
    timeRangeEnd,
    setTimeRangeStart,
    setTimeRangeEnd,
    handleTimeRangeChange,
    resetFilters
  };
} 