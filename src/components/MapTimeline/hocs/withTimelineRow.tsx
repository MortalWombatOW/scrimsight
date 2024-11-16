import React from 'react';
import { useTimelineContext } from '../context/TimelineContext';
import { BaseTimelineRowProps } from '../types/row.types';

export const withTimelineRow = <P extends BaseTimelineRowProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: Omit<P, keyof BaseTimelineRowProps>) => {
    const { dimensions } = useTimelineContext();

    return <WrappedComponent {...(props as P)} dimensions={dimensions} />;
  };
}; 