import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import SampleData from './SampleData';

// Mock console.log to verify component mounting
const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});

// Mock the useLoadSampleData hook
vi.mock('../hooks/useLoadSampleData', () => ({
  useLoadSampleData: vi.fn(),
}));

// Get reference to the mocked function
import { useLoadSampleData } from '../hooks/useLoadSampleData';
const mockUseLoadSampleData = vi.mocked(useLoadSampleData);

describe('SampleData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering children', () => {
    it('should render its children', () => {
      render(
        <SampleData>
          <div data-testid="test-child">Test Content</div>
        </SampleData>
      );
      
      expect(screen.getByTestId('test-child')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render multiple children', () => {
      render(
        <SampleData>
          <div data-testid="child-1">First Child</div>
          <div data-testid="child-2">Second Child</div>
          <span data-testid="child-3">Third Child</span>
        </SampleData>
      );
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
      expect(screen.getByTestId('child-3')).toBeInTheDocument();
      expect(screen.getByText('First Child')).toBeInTheDocument();
      expect(screen.getByText('Second Child')).toBeInTheDocument();
      expect(screen.getByText('Third Child')).toBeInTheDocument();
    });

    it('should render complex JSX children', () => {
      const ComplexChild = (
        <div className="card">
          <h2 className="card-title">Sample Data Loaded</h2>
          <p>This component has triggered the loading of sample data.</p>
          <button className="btn btn-primary">View Data</button>
        </div>
      );

      render(<SampleData>{ComplexChild}</SampleData>);
      
      expect(screen.getByText('Sample Data Loaded')).toBeInTheDocument();
      expect(screen.getByText('This component has triggered the loading of sample data.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'View Data' })).toBeInTheDocument();
    });

    it('should render empty children without error', () => {
      render(<SampleData><></></SampleData>);
      
      // Component should render without throwing, even with empty fragment
      expect(mockUseLoadSampleData).toHaveBeenCalledWith(true);
    });

    it('should render null children without error', () => {
      render(<SampleData>{null}</SampleData>);
      
      expect(mockUseLoadSampleData).toHaveBeenCalledWith(true);
    });

    it('should render undefined children without error', () => {
      render(<SampleData>{undefined}</SampleData>);
      
      expect(mockUseLoadSampleData).toHaveBeenCalledWith(true);
    });

    it('should render boolean children without error', () => {
      render(<SampleData>{false}</SampleData>);
      
      expect(mockUseLoadSampleData).toHaveBeenCalledWith(true);
    });

    it('should render string children', () => {
      render(<SampleData>Simple text content</SampleData>);
      
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('should render number children', () => {
      render(<SampleData>{42}</SampleData>);
      
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should render array of children', () => {
      const arrayChildren = [
        <div key="1" data-testid="array-child-1">First</div>,
        <div key="2" data-testid="array-child-2">Second</div>,
      ];

      render(<SampleData>{arrayChildren}</SampleData>);
      
      expect(screen.getByTestId('array-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('array-child-2')).toBeInTheDocument();
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });
  });

  describe('sample data loading', () => {
    it('should call useLoadSampleData hook with true', () => {
      render(
        <SampleData>
          <div>Test Content</div>
        </SampleData>
      );
      
      expect(mockUseLoadSampleData).toHaveBeenCalledWith(true);
      expect(mockUseLoadSampleData).toHaveBeenCalledTimes(1);
    });

    it('should call useLoadSampleData hook on every render', () => {
      const { rerender } = render(
        <SampleData>
          <div>Initial Content</div>
        </SampleData>
      );
      
      expect(mockUseLoadSampleData).toHaveBeenCalledTimes(1);
      
      rerender(
        <SampleData>
          <div>Updated Content</div>
        </SampleData>
      );
      
      expect(mockUseLoadSampleData).toHaveBeenCalledTimes(2);
    });

    it('should maintain hook call even with different children', () => {
      const { rerender } = render(
        <SampleData>
          <div>First Content</div>
        </SampleData>
      );
      
      expect(mockUseLoadSampleData).toHaveBeenCalledWith(true);
      
      rerender(
        <SampleData>
          <span>Different Content</span>
        </SampleData>
      );
      
      expect(mockUseLoadSampleData).toHaveBeenCalledWith(true);
      expect(mockUseLoadSampleData).toHaveBeenCalledTimes(2);
    });
  });

  describe('component mounting behavior', () => {
    it('should log component mounting message', () => {
      render(
        <SampleData>
          <div>Test Content</div>
        </SampleData>
      );
      
      expect(mockConsoleLog).toHaveBeenCalledWith('SampleData component mounted');
    });

    it('should log mounting message on each render', () => {
      const { rerender } = render(
        <SampleData>
          <div>Initial</div>
        </SampleData>
      );
      
      expect(mockConsoleLog).toHaveBeenCalledWith('SampleData component mounted');
      
      rerender(
        <SampleData>
          <div>Updated</div>
        </SampleData>
      );
      
      expect(mockConsoleLog).toHaveBeenCalledTimes(2);
      expect(mockConsoleLog).toHaveBeenNthCalledWith(1, 'SampleData component mounted');
      expect(mockConsoleLog).toHaveBeenNthCalledWith(2, 'SampleData component mounted');
    });
  });

  describe('component behavior', () => {
    it('should be a pass-through component that renders children unchanged', () => {
      const originalContent = (
        <div className="custom-class" data-custom="value">
          <h1>Title</h1>
          <p className="text-gray-500">Description</p>
        </div>
      );

      render(<SampleData>{originalContent}</SampleData>);
      
      const titleElement = screen.getByRole('heading', { level: 1 });
      expect(titleElement).toHaveTextContent('Title');
      
      const descriptionElement = screen.getByText('Description');
      expect(descriptionElement).toHaveClass('text-gray-500');
      
      const containerElement = screen.getByText('Title').parentElement;
      expect(containerElement).toHaveClass('custom-class');
      expect(containerElement).toHaveAttribute('data-custom', 'value');
    });

    it('should not interfere with event handlers in children', () => {
      const handleClick = vi.fn();
      
      render(
        <SampleData>
          <button onClick={handleClick} data-testid="clickable-button">
            Click me
          </button>
        </SampleData>
      );
      
      const button = screen.getByTestId('clickable-button');
      button.click();
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not interfere with form inputs in children', () => {
      render(
        <SampleData>
          <form>
            <input data-testid="test-input" placeholder="Enter text" />
            <select data-testid="test-select">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
            </select>
          </form>
        </SampleData>
      );
      
      const input = screen.getByTestId('test-input');
      const select = screen.getByTestId('test-select');
      
      expect(input).toBeInTheDocument();
      expect(select).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('should preserve CSS classes and styles from children', () => {
      render(
        <SampleData>
          <div 
            className="bg-blue-500 text-white p-4" 
            style={{ fontSize: '18px', marginTop: '10px' }}
            data-testid="styled-element"
          >
            Styled Content
          </div>
        </SampleData>
      );
      
      const styledElement = screen.getByTestId('styled-element');
      expect(styledElement).toHaveClass('bg-blue-500', 'text-white', 'p-4');
      expect(styledElement).toHaveStyle({ fontSize: '18px', marginTop: '10px' });
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle children with React fragments', () => {
      render(
        <SampleData>
          <React.Fragment>
            <span data-testid="fragment-child-1">Fragment Child 1</span>
            <span data-testid="fragment-child-2">Fragment Child 2</span>
          </React.Fragment>
        </SampleData>
      );
      
      expect(screen.getByTestId('fragment-child-1')).toBeInTheDocument();
      expect(screen.getByTestId('fragment-child-2')).toBeInTheDocument();
    });

    it('should handle nested SampleData components', () => {
      render(
        <SampleData>
          <div data-testid="outer-content">
            Outer Content
            <SampleData>
              <div data-testid="inner-content">Inner Content</div>
            </SampleData>
          </div>
        </SampleData>
      );
      
      expect(screen.getByTestId('outer-content')).toBeInTheDocument();
      expect(screen.getByTestId('inner-content')).toBeInTheDocument();
      expect(screen.getByText('Outer Content')).toBeInTheDocument();
      expect(screen.getByText('Inner Content')).toBeInTheDocument();
      
      // Both instances should call the hook
      expect(mockUseLoadSampleData).toHaveBeenCalledTimes(2);
    });

    it('should handle conditional rendering in children', () => {
      const showContent = true;
      
      render(
        <SampleData>
          {showContent && <div data-testid="conditional-content">Conditional Content</div>}
          {!showContent && <div data-testid="alternative-content">Alternative Content</div>}
        </SampleData>
      );
      
      expect(screen.getByTestId('conditional-content')).toBeInTheDocument();
      expect(screen.queryByTestId('alternative-content')).not.toBeInTheDocument();
    });

    it('should handle children with keys', () => {
      const items = ['Item 1', 'Item 2', 'Item 3'];
      
      render(
        <SampleData>
          {items.map((item, index) => (
            <div key={index} data-testid={`item-${index}`}>
              {item}
            </div>
          ))}
        </SampleData>
      );
      
      items.forEach((item, index) => {
        expect(screen.getByTestId(`item-${index}`)).toBeInTheDocument();
        expect(screen.getByText(item)).toBeInTheDocument();
      });
    });
  });

  describe('integration scenarios', () => {
    it('should work with DaisyUI components', () => {
      render(
        <SampleData>
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Sample Data Card</h2>
              <p>Card content with sample data loading.</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Action</button>
              </div>
            </div>
          </div>
        </SampleData>
      );
      
      expect(screen.getByText('Sample Data Card')).toBeInTheDocument();
      expect(screen.getByText('Card content with sample data loading.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('should work with loading states', () => {
      render(
        <SampleData>
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner loading-sm"></span>
            <span className="text-sm">Loading sample data...</span>
          </div>
        </SampleData>
      );
      
      expect(screen.getByText('Loading sample data...')).toBeInTheDocument();
    });

    it('should work with alert components', () => {
      render(
        <SampleData>
          <div className="alert alert-info">
            <svg className="stroke-current shrink-0 w-6 h-6" data-testid="alert-icon">
              <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">Demo Mode Active!</h3>
              <div className="text-xs">Sample data has been loaded.</div>
            </div>
          </div>
        </SampleData>
      );
      
      expect(screen.getByText('Demo Mode Active!')).toBeInTheDocument();
      expect(screen.getByText('Sample data has been loaded.')).toBeInTheDocument();
      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
    });
  });
});