import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import PrimaryButton from './PrimaryButton';

describe('PrimaryButton', () => {
  describe('rendering', () => {
    it('should render button with correct base classes', () => {
      render(<PrimaryButton>Test Button</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn', 'btn-primary', 'w-fit');
    });

    it('should render children content', () => {
      render(<PrimaryButton>Click me</PrimaryButton>);
      
      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render complex children content', () => {
      const ComplexContent = (
        <span>
          <strong>Bold</strong> and <em>italic</em> text
        </span>
      );
      
      render(<PrimaryButton>{ComplexContent}</PrimaryButton>);
      
      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('italic')).toBeInTheDocument();
    });

    it('should render JSX elements as children', () => {
      const IconContent = (
        <>
          <svg data-testid="icon" className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Item
        </>
      );
      
      render(<PrimaryButton>{IconContent}</PrimaryButton>);
      
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Add Item')).toBeInTheDocument();
    });
  });

  describe('click behavior', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = vi.fn();
      render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick handler multiple times when clicked multiple times', () => {
      const handleClick = vi.fn();
      render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should not call onClick handler when no handler is provided', () => {
      // This should not throw any errors
      render(<PrimaryButton>Click me</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(() => fireEvent.click(button)).not.toThrow();
    });
  });

  describe('disabled state', () => {
    it('should not be disabled by default', () => {
      render(<PrimaryButton>Click me</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<PrimaryButton disabled>Disabled button</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('should not be disabled when disabled prop is false', () => {
      render(<PrimaryButton disabled={false}>Enabled button</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });

    it('should not call onClick handler when disabled and clicked', () => {
      const handleClick = vi.fn();
      render(
        <PrimaryButton onClick={handleClick} disabled>
          Disabled button
        </PrimaryButton>
      );
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have button role', () => {
      render(<PrimaryButton>Test Button</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should be focusable when not disabled', () => {
      render(<PrimaryButton>Focusable button</PrimaryButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should not be focusable when disabled', () => {
      render(<PrimaryButton disabled>Non-focusable button</PrimaryButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).not.toHaveFocus();
    });

    it('should support keyboard interaction (Enter key)', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<PrimaryButton onClick={handleClick}>Keyboard button</PrimaryButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should support keyboard interaction (Space key)', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();
      render(<PrimaryButton onClick={handleClick}>Keyboard button</PrimaryButton>);
      
      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('button types and behavior', () => {
    it('should be a button element', () => {
      render(<PrimaryButton>Default type button</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button.tagName).toBe('BUTTON');
    });
  });

  describe('edge cases', () => {
    it('should handle empty children', () => {
      render(<PrimaryButton></PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toBeEmptyDOMElement();
    });

    it('should handle null children', () => {
      render(<PrimaryButton>{null}</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      render(<PrimaryButton>{undefined}</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should handle boolean children', () => {
      render(<PrimaryButton>{false}</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('should handle number children', () => {
      render(<PrimaryButton>{42}</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('42');
    });

    it('should handle array of children', () => {
      const arrayChildren = ['First', ' ', 'Second'];
      render(<PrimaryButton>{arrayChildren}</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('First Second');
    });
  });

  describe('styling and layout', () => {
    it('should have w-fit class for proper width fitting', () => {
      render(<PrimaryButton>Test content</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-fit');
    });

    it('should maintain primary button styling', () => {
      render(<PrimaryButton>Primary styled</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn-primary');
    });

    it('should use DaisyUI btn base class', () => {
      render(<PrimaryButton>DaisyUI button</PrimaryButton>);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('btn');
    });
  });
});