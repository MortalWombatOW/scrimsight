import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TimelineBar, { Segment } from './TimelineBar';

const mockSegments: Segment[] = [
  {
    id: 'segment-1',
    start: 0,
    end: 50,
    color: '#ef4444',
    icon: <span data-testid="segment-1-icon">⚔️</span>,
  },
  {
    id: 'segment-2',
    start: 50,
    end: 100,
    color: '#22c55e',
  },
  {
    id: 'segment-3',
    start: 100,
    end: 150,
    color: '#3b82f6',
    icon: <span data-testid="segment-3-icon">🛡️</span>,
  },
];

describe('TimelineBar', () => {
  describe('basic rendering', () => {
    it('should render timeline container with correct structure', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const timelineContainer = container.querySelector('.w-full');
      expect(timelineContainer).toBeInTheDocument();

      const barContainer = container.querySelector('.relative.bg-base-300.rounded-lg.overflow-hidden');
      expect(barContainer).toBeInTheDocument();
    });

    it('should render SVG with correct accessibility attributes', () => {
      render(<TimelineBar segments={mockSegments} total={200} />);

      const svg = screen.getByRole('img');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-label', 'Timeline bar with interactive segments');
      expect(svg).toHaveAttribute('width', '100%');
    });

    it('should render start and end labels', () => {
      render(<TimelineBar segments={mockSegments} total={200} />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });

    it('should apply correct height to container and SVG', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const barContainer = container.querySelector('.relative');
      expect(barContainer).toHaveStyle({ height: '40px' });

      const svg = screen.getByRole('img');
      expect(svg).toHaveAttribute('height', '40');
    });
  });

  describe('segment rendering', () => {
    it('should render all segments as rectangles', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const rects = container.querySelectorAll('rect');
      expect(rects).toHaveLength(3);
    });

    it('should apply correct colors to segments', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const rects = container.querySelectorAll('rect');
      expect(rects[0]).toHaveAttribute('fill', '#ef4444');
      expect(rects[1]).toHaveAttribute('fill', '#22c55e');
      expect(rects[2]).toHaveAttribute('fill', '#3b82f6');
    });

    it('should calculate correct segment widths', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const rects = container.querySelectorAll('rect');
      // Segment 1: (50-0)/200 * 100 = 25%
      expect(rects[0]).toHaveAttribute('width', '25%');
      // Segment 2: (100-50)/200 * 100 = 25%
      expect(rects[1]).toHaveAttribute('width', '25%');
      // Segment 3: (150-100)/200 * 100 = 25%
      expect(rects[2]).toHaveAttribute('width', '25%');
    });

    it('should calculate correct segment positions', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const rects = container.querySelectorAll('rect');
      // Segment 1: 0/200 * 100 = 0%
      expect(rects[0]).toHaveAttribute('x', '0%');
      // Segment 2: 50/200 * 100 = 25%
      expect(rects[1]).toHaveAttribute('x', '25%');
      // Segment 3: 100/200 * 100 = 50%
      expect(rects[2]).toHaveAttribute('x', '50%');
    });

    it('should render segment icons when provided', () => {
      render(<TimelineBar segments={mockSegments} total={200} />);

      expect(screen.getByTestId('segment-1-icon')).toBeInTheDocument();
      expect(screen.getByTestId('segment-3-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('segment-2-icon')).not.toBeInTheDocument();
    });

    it('should position icons correctly within segments', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const foreignObjects = container.querySelectorAll('foreignObject');
      expect(foreignObjects).toHaveLength(2); // Only segments with icons

      // Icon positioning: calc(left% + iconSize/2)
      expect(foreignObjects[0]).toHaveAttribute('x', 'calc(0% + 8px)'); // segment-1
      expect(foreignObjects[1]).toHaveAttribute('x', 'calc(50% + 8px)'); // segment-3
      
      // Icon should be vertically centered: (barHeight - iconSize) / 2 = (40 - 16) / 2 = 12
      expect(foreignObjects[0]).toHaveAttribute('y', '12');
      expect(foreignObjects[1]).toHaveAttribute('y', '12');
    });

    it('should apply correct icon styling', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const iconContainers = container.querySelectorAll('foreignObject .flex');
      iconContainers.forEach(iconContainer => {
        expect(iconContainer).toHaveClass('items-center', 'justify-center', 'text-white', 'drop-shadow-sm');
      });
    });
  });

  describe('accessibility', () => {
    it('should provide aria-labels for segments', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const rects = container.querySelectorAll('rect');
      expect(rects[0]).toHaveAttribute('aria-label', 'Segment segment-1 from 0 to 50');
      expect(rects[1]).toHaveAttribute('aria-label', 'Segment segment-2 from 50 to 100');
      expect(rects[2]).toHaveAttribute('aria-label', 'Segment segment-3 from 100 to 150');
    });

    it('should set role to presentation when no click handler provided', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const rects = container.querySelectorAll('rect');
      rects.forEach(rect => {
        expect(rect).toHaveAttribute('role', 'presentation');
        expect(rect).toHaveAttribute('tabindex', '-1');
      });
    });

    it('should set role to button when click handler provided', () => {
      const mockOnClick = vi.fn();
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} onSegmentClick={mockOnClick} />
      );

      const rects = container.querySelectorAll('rect');
      rects.forEach(rect => {
        expect(rect).toHaveAttribute('role', 'button');
        expect(rect).toHaveAttribute('tabindex', '0');
      });
    });
  });

  describe('interactivity', () => {
    it('should call onSegmentClick when segment is clicked', () => {
      const mockOnClick = vi.fn();
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} onSegmentClick={mockOnClick} />
      );

      const rects = container.querySelectorAll('rect');
      fireEvent.click(rects[0]);
      expect(mockOnClick).toHaveBeenCalledWith('segment-1');

      fireEvent.click(rects[1]);
      expect(mockOnClick).toHaveBeenCalledWith('segment-2');

      fireEvent.click(rects[2]);
      expect(mockOnClick).toHaveBeenCalledWith('segment-3');
    });

    it('should call onSegmentClick when Enter key is pressed', () => {
      const mockOnClick = vi.fn();
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} onSegmentClick={mockOnClick} />
      );

      const rects = container.querySelectorAll('rect');
      fireEvent.keyDown(rects[0], { key: 'Enter' });
      expect(mockOnClick).toHaveBeenCalledWith('segment-1');
    });

    it('should call onSegmentClick when Space key is pressed', () => {
      const mockOnClick = vi.fn();
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} onSegmentClick={mockOnClick} />
      );

      const rects = container.querySelectorAll('rect');
      fireEvent.keyDown(rects[1], { key: ' ' });
      expect(mockOnClick).toHaveBeenCalledWith('segment-2');
    });

    it('should not call onSegmentClick for other keys', () => {
      const mockOnClick = vi.fn();
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} onSegmentClick={mockOnClick} />
      );

      const rects = container.querySelectorAll('rect');
      fireEvent.keyDown(rects[0], { key: 'Tab' });
      fireEvent.keyDown(rects[0], { key: 'Escape' });
      fireEvent.keyDown(rects[0], { key: 'a' });
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it('should not call onSegmentClick when no handler provided', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const rects = container.querySelectorAll('rect');
      // This should not throw an error
      fireEvent.click(rects[0]);
      fireEvent.keyDown(rects[0], { key: 'Enter' });
    });

    it('should apply interactive styles when click handler provided', () => {
      const mockOnClick = vi.fn();
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} onSegmentClick={mockOnClick} />
      );

      const rects = container.querySelectorAll('rect');
      rects.forEach(rect => {
        expect(rect).toHaveClass('cursor-pointer', 'hover:opacity-80', 'focus:opacity-80');
      });
    });

    it('should not apply interactive styles when no click handler provided', () => {
      const { container } = render(
        <TimelineBar segments={mockSegments} total={200} />
      );

      const rects = container.querySelectorAll('rect');
      rects.forEach(rect => {
        expect(rect).not.toHaveClass('cursor-pointer', 'hover:opacity-80', 'focus:opacity-80');
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty segments array', () => {
      const { container } = render(
        <TimelineBar segments={[]} total={100} />
      );

      expect(screen.getByRole('img')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
      
      const rects = container.querySelectorAll('rect');
      expect(rects).toHaveLength(0);
    });

    it('should handle single segment filling entire timeline', () => {
      const singleSegment: Segment[] = [{
        id: 'full',
        start: 0,
        end: 100,
        color: '#22c55e',
      }];

      const { container } = render(
        <TimelineBar segments={singleSegment} total={100} />
      );

      const rect = container.querySelector('rect');
      expect(rect).toHaveAttribute('x', '0%');
      expect(rect).toHaveAttribute('width', '100%');
    });

    it('should handle very small segments', () => {
      const smallSegments: Segment[] = [{
        id: 'tiny',
        start: 0,
        end: 1,
        color: '#ef4444',
      }];

      const { container } = render(
        <TimelineBar segments={smallSegments} total={1000} />
      );

      const rect = container.querySelector('rect');
      expect(rect).toHaveAttribute('width', '0.1%');
    });

    it('should handle zero total duration', () => {
      render(
        <TimelineBar segments={[]} total={0} />
      );

      const zeroTexts = screen.getAllByText('0');
      expect(zeroTexts).toHaveLength(2); // Start and end labels both show 0
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should handle segments with same start and end', () => {
      const zeroWidthSegment: Segment[] = [{
        id: 'instant',
        start: 50,
        end: 50,
        color: '#8b5cf6',
      }];

      const { container } = render(
        <TimelineBar segments={zeroWidthSegment} total={100} />
      );

      const rect = container.querySelector('rect');
      expect(rect).toHaveAttribute('width', '0%');
      expect(rect).toHaveAttribute('x', '50%');
    });

    it('should handle segments that exceed total duration', () => {
      const oversizedSegment: Segment[] = [{
        id: 'oversized',
        start: 0,
        end: 150,
        color: '#f59e0b',
      }];

      const { container } = render(
        <TimelineBar segments={oversizedSegment} total={100} />
      );

      const rect = container.querySelector('rect');
      expect(rect).toHaveAttribute('width', '150%'); // Would overflow
    });

    it('should handle very large total values', () => {
      const largeTotal = 999999;
      render(
        <TimelineBar segments={mockSegments} total={largeTotal} />
      );

      expect(screen.getByText('999999')).toBeInTheDocument();
      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should handle segments with complex icons', () => {
      const complexIconSegments: Segment[] = [{
        id: 'complex',
        start: 0,
        end: 50,
        color: '#ef4444',
        icon: (
          <div data-testid="complex-icon">
            <span>Complex</span>
            <strong>Icon</strong>
          </div>
        ),
      }];

      render(<TimelineBar segments={complexIconSegments} total={100} />);

      expect(screen.getByTestId('complex-icon')).toBeInTheDocument();
      expect(screen.getByText('Complex')).toBeInTheDocument();
      expect(screen.getByText('Icon')).toBeInTheDocument();
    });
  });

  describe('mathematical calculations', () => {
    it('should calculate correct percentages for various segment ratios', () => {
      const testSegments: Segment[] = [
        { id: '1', start: 0, end: 25, color: '#000' },    // 25% width, 0% left
        { id: '2', start: 25, end: 75, color: '#111' },   // 50% width, 25% left
        { id: '3', start: 75, end: 100, color: '#222' },  // 25% width, 75% left
      ];

      const { container } = render(
        <TimelineBar segments={testSegments} total={100} />
      );

      const rects = container.querySelectorAll('rect');
      
      // First segment: 25% width, 0% left
      expect(rects[0]).toHaveAttribute('width', '25%');
      expect(rects[0]).toHaveAttribute('x', '0%');
      
      // Second segment: 50% width, 25% left
      expect(rects[1]).toHaveAttribute('width', '50%');
      expect(rects[1]).toHaveAttribute('x', '25%');
      
      // Third segment: 25% width, 75% left
      expect(rects[2]).toHaveAttribute('width', '25%');
      expect(rects[2]).toHaveAttribute('x', '75%');
    });

    it('should handle fractional calculations correctly', () => {
      const fractionalSegments: Segment[] = [{
        id: 'fraction',
        start: 1.5,
        end: 2.7,
        color: '#333',
      }];

      const { container } = render(
        <TimelineBar segments={fractionalSegments} total={10} />
      );

      const rect = container.querySelector('rect');
      // Width: (2.7 - 1.5) / 10 * 100 = 12% (with floating point precision)
      expect(rect).toHaveAttribute('width', '12.000000000000002%');
      // Left: 1.5 / 10 * 100 = 15%
      expect(rect).toHaveAttribute('x', '15%');
    });
  });
});