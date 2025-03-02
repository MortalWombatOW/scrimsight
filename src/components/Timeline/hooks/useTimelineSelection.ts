import { useState, useCallback } from 'react';
import { TimelineData, TimelineSegment } from './useTimelineData';

interface UseTimelineSelectionProps {
  data: TimelineData;
}

export interface UseTimelineSelectionResult {
  selectedEvents: string[];
  selectedSegments: TimelineSegment[];
  handleEventSelect: (eventIds: string[]) => void;
  handleSegmentSelect: (segmentIds: string[]) => void;
  clearSelection: () => void;
}

/**
 * Custom hook for managing timeline selection state
 */
export function useTimelineSelection({ data }: UseTimelineSelectionProps): UseTimelineSelectionResult {
  // State for selected events and segments
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [selectedSegments, setSelectedSegments] = useState<TimelineSegment[]>([]);

  // Handle event selection
  const handleEventSelect = useCallback((eventIds: string[]) => {
    setSelectedEvents(eventIds);
    
    // Clear segment selection when selecting events
    if (eventIds.length > 0) {
      setSelectedSegments([]);
    }
  }, []);

  // Handle segment selection
  const handleSegmentSelect = useCallback((segmentIds: string[]) => {
    if (!data || !data.segments) return;
    
    // Find the selected segments in the data
    const segments = segmentIds.map(id => 
      data.segments.find(segment => segment.id === id)
    ).filter((segment): segment is TimelineSegment => segment !== undefined);
    
    setSelectedSegments(segments);
    
    // Clear event selection when selecting segments
    if (segments.length > 0) {
      setSelectedEvents([]);
    }
  }, [data]);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedEvents([]);
    setSelectedSegments([]);
  }, []);

  return {
    selectedEvents,
    selectedSegments,
    handleEventSelect,
    handleSegmentSelect,
    clearSelection
  };
} 