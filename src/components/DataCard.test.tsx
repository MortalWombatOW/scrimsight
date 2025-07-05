
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DataCard from './DataCard';

describe('DataCard', () => {
  it('renders with provided content and width', () => {
    const testContent = <div data-testid="test-content">Hello World</div>;
    const testWidth = 150;

    render(
      <DataCard width={testWidth}>
        {testContent}
      </DataCard>
    );

    const cardElement = screen.getByTestId('data-card');
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveStyle(`width: ${testWidth}px`);
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('applies additional class names', () => {
    render(
      <DataCard width={100} className="extra-class">
        <div>Content</div>
      </DataCard>
    );

    const cardElement = screen.getByTestId('data-card');
    expect(cardElement).toHaveClass('extra-class');
  });

  it('renders with a background element if provided', () => {
    const backgroundElement = <img data-testid="background-image" src="test.png" alt="" />;

    render(
      <DataCard width={100} background={backgroundElement}>
        <div>Content</div>
      </DataCard>
    );

    expect(screen.getByTestId('background-image')).toBeInTheDocument();
  });

  it('renders with a background color if provided', () => {
    render(
      <DataCard width={100} backgroundColor="#FF0000">
        <div>Content</div>
      </DataCard>
    );

    const cardElement = screen.getByTestId('data-card');
    expect(cardElement).toHaveStyle('background-color: rgb(255, 0, 0)');
  });
});
