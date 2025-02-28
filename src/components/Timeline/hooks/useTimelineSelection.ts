import { useState, useCallback } from 'react';
import type { TimelineData } from './useTimelineData';

interface UseTimelineSelectionProps {
  data: TimelineData;
}

interface UseTimelineSelectionResult {
  selectedEvents: string[];
  handleEventSelect: (eventIds: string[]) => void;
  clearSelection: () => void;
  isEventSelected: (eventId: string) => boolean;
  getSelectedEventData: () => any[];
}

/**
 * Custom hook for managing timeline event selection
 * Extracts selection logic from the Timeline component
 */
export function useTimelineSelection({ data }: UseTimelineSelectionProps): UseTimelineSelectionResult {
  // State for selected events
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);

  // Handle event selection from the visualization
  const handleEventSelect = useCallback(
    (eventIds: string[]) => {
      // Only update if the selection has changed
      if (
        selectedEvents.length !== eventIds.length ||
        !selectedEvents.every((event) => eventIds.includes(event))
      ) {
        setSelectedEvents(eventIds);
      }
    },
    [selectedEvents]
  );

  // Clear all selected events
  const clearSelection = useCallback(() => {
    setSelectedEvents([]);
  }, []);

  // Check if a specific event is selected
  const isEventSelected = useCallback(
    (eventId: string) => {
      return selectedEvents.includes(eventId);
    },
    [selectedEvents]
  );

  // Get the full data for selected events
  const getSelectedEventData = useCallback(() => {
    return selectedEvents
      .map((id) => data.events.find((event) => event.id === id))
      .filter((event) => event !== undefined);
  }, [selectedEvents, data.events]);

  return {
    selectedEvents,
    handleEventSelect,
    clearSelection,
    isEventSelected,
    getSelectedEventData
  };
} 