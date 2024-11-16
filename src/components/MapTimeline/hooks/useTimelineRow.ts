import { useCallback } from 'react';
import { useTimelineContext } from '../context/TimelineContext';

export const useTimelineRow = (rowId: string) => {
  const { dimensions, labelWidth, setLabelWidth, handleDeleteRow } = useTimelineContext();

  const onDelete = useCallback(() => {
    handleDeleteRow(rowId);
  }, [handleDeleteRow, rowId]);

  return {
    dimensions,
    labelWidth,
    onLabelWidthChange: setLabelWidth,
    onDelete,
  };
}; 