
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TeamCard from './TeamCard';
import { getColorgoricalWithAlt } from '../lib/color';

describe('TeamCard', () => {
  const teamName = 'My Awesome Team';

  it('renders the team card with the correct team initials', () => {
    render(<TeamCard teamName={teamName} />);

    const initialsElement = screen.getByText('MAT');
    expect(initialsElement).toHaveClass('text-4xl');
    expect(screen.getByText(teamName)).toBeInTheDocument();
  });

  it('applies deterministic background and text colors', () => {
    render(<TeamCard teamName={teamName} />);

    const [expectedMainColor, expectedAltColor] = getColorgoricalWithAlt(teamName);

    const cardElement = screen.getByTestId('data-card');
    expect(cardElement).toHaveStyle(`background-color: ${expectedMainColor}`);

    const initialsElement = screen.getByText('MAT');
    expect(initialsElement).toHaveStyle(`color: ${expectedAltColor}`);
  });
});
