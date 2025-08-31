import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricPicker from './MetricPicker';
import { PlayerStatsNumericalKeys } from '../lib/ScrimsightDataModel';

const mockMetrics: PlayerStatsNumericalKeys[] = [
  'eliminations',
  'finalBlows',
  'deaths',
  'heroDamageDealt',
  'healingDealt',
  'eliminationsPer10Minutes',
  'weaponAccuracy'
];

describe('MetricPicker', () => {
  describe('initial render', () => {
    it('should render dropdown button with selected metric', () => {
      const mockOnChange = vi.fn();
      
      render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('eliminations');
    });

    it('should render chevron down icon', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const chevronIcon = container.querySelector('.lucide');
      expect(chevronIcon).toBeInTheDocument();
    });

    it('should apply correct button classes', () => {
      const mockOnChange = vi.fn();
      
      render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn', 'btn-sm', 'w-full', 'justify-between');
    });

    it('should truncate long metric names', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminationsPer10Minutes"
          onChange={mockOnChange}
        />
      );
      
      const span = container.querySelector('.truncate');
      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('eliminationsPer10Minutes');
    });
  });

  describe('dropdown menu', () => {
    it('should render dropdown menu with all metrics', () => {
      const mockOnChange = vi.fn();
      
      render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const menu = screen.getByRole('list');
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveClass('dropdown-content', 'menu', 'bg-base-100', 'rounded-box', 'z-[1]', 'w-52', 'p-2', 'shadow');
    });

    it('should render all metric options as menu items', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const menuItems = container.querySelectorAll('li');
      expect(menuItems).toHaveLength(mockMetrics.length);
      
      // Verify each metric appears in the dropdown (excluding the button text)
      mockMetrics.forEach(metric => {
        const menuItem = Array.from(menuItems).find(li => li.textContent === metric);
        expect(menuItem).toBeInTheDocument();
      });
    });

    it('should mark selected metric as active', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="heroDamageDealt"
          onChange={mockOnChange}
        />
      );
      
      const activeLink = container.querySelector('.active');
      expect(activeLink).toBeInTheDocument();
      expect(activeLink).toHaveTextContent('heroDamageDealt');
    });

    it('should not mark non-selected metrics as active', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="heroDamageDealt"
          onChange={mockOnChange}
        />
      );
      
      const allLinks = container.querySelectorAll('a');
      const nonActiveLinks = Array.from(allLinks).filter(link => 
        link.textContent === 'eliminations' && !link.classList.contains('active')
      );
      expect(nonActiveLinks.length).toBeGreaterThan(0);
    });
  });

  describe('user interactions', () => {
    it('should call onChange when metric is clicked', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const finalBlowsLink = Array.from(container.querySelectorAll('a')).find(
        link => link.textContent === 'finalBlows'
      );
      fireEvent.click(finalBlowsLink!);
      
      expect(mockOnChange).toHaveBeenCalledWith('finalBlows');
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it('should call onChange with correct metric when different options are clicked', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const deathsLink = Array.from(container.querySelectorAll('a')).find(
        link => link.textContent === 'deaths'
      );
      fireEvent.click(deathsLink!);
      expect(mockOnChange).toHaveBeenCalledWith('deaths');
      
      const healingLink = Array.from(container.querySelectorAll('a')).find(
        link => link.textContent === 'healingDealt'
      );
      fireEvent.click(healingLink!);
      expect(mockOnChange).toHaveBeenCalledWith('healingDealt');
      
      expect(mockOnChange).toHaveBeenCalledTimes(2);
    });

    it('should allow clicking on already selected metric', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const selectedLink = container.querySelector('.active');
      fireEvent.click(selectedLink!);
      
      expect(mockOnChange).toHaveBeenCalledWith('eliminations');
    });
  });

  describe('accessibility', () => {
    it('should have proper tabIndex on dropdown trigger', () => {
      const mockOnChange = vi.fn();
      
      render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabIndex', '0');
    });

    it('should have proper tabIndex on dropdown menu', () => {
      const mockOnChange = vi.fn();
      
      render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const menu = screen.getByRole('list');
      expect(menu).toHaveAttribute('tabIndex', '0');
    });

    it('should have proper role attributes', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('list')).toBeInTheDocument();
      
      const links = container.querySelectorAll('a');
      expect(links).toHaveLength(mockMetrics.length);
    });
  });

  describe('dropdown structure', () => {
    it('should render dropdown container with correct classes', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const dropdown = container.querySelector('.dropdown');
      expect(dropdown).toBeInTheDocument();
    });

    it('should render each metric as a list item', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const listItems = container.querySelectorAll('li');
      expect(listItems).toHaveLength(mockMetrics.length);
    });
  });

  describe('edge cases', () => {
    it('should handle empty metrics array', () => {
      const mockOnChange = vi.fn();
      
      render(
        <MetricPicker
          metrics={[]}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const menu = screen.getByRole('list');
      expect(menu).toBeInTheDocument();
      
      const listItems = menu.querySelectorAll('li');
      expect(listItems).toHaveLength(0);
    });

    it('should handle single metric', () => {
      const mockOnChange = vi.fn();
      const singleMetric: PlayerStatsNumericalKeys[] = ['eliminations'];
      
      const { container } = render(
        <MetricPicker
          metrics={singleMetric}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const menu = screen.getByRole('list');
      const listItems = menu.querySelectorAll('li');
      expect(listItems).toHaveLength(1);
      
      const activeLink = container.querySelector('.active');
      expect(activeLink).toBeInTheDocument();
      expect(activeLink).toHaveTextContent('eliminations');
    });

    it('should handle selected metric not in metrics array', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="nonExistentMetric"
          onChange={mockOnChange}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('nonExistentMetric');
      
      // No metric should be marked as active
      const activeLinks = container.querySelectorAll('.active');
      expect(activeLinks).toHaveLength(0);
    });

    it('should handle very long metric names', () => {
      const mockOnChange = vi.fn();
      const longMetrics: PlayerStatsNumericalKeys[] = [
        'heroDamageDealtPer10Minutes' as PlayerStatsNumericalKeys,
        'barrierDamageDealtPer10Minutes' as PlayerStatsNumericalKeys
      ];
      
      const { container } = render(
        <MetricPicker
          metrics={longMetrics}
          selected="heroDamageDealtPer10Minutes"
          onChange={mockOnChange}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('heroDamageDealtPer10Minutes');
      
      const span = container.querySelector('.truncate');
      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent('heroDamageDealtPer10Minutes');
    });
  });

  describe('icon styling', () => {
    it('should apply correct classes to chevron icon', () => {
      const mockOnChange = vi.fn();
      
      const { container } = render(
        <MetricPicker
          metrics={mockMetrics}
          selected="eliminations"
          onChange={mockOnChange}
        />
      );
      
      const chevronIcon = container.querySelector('.lucide');
      expect(chevronIcon).toHaveClass('h-4', 'w-4', 'opacity-50');
    });
  });
});