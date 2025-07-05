import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroCard from './HeroCard';
import { formatDuration } from '../lib/format';

describe('HeroCard', () => {
  const hero = 'Ana';
  const playtime = 3600; // 1 hour

  it('renders the hero card with the correct hero name and playtime', () => {
    render(<HeroCard hero={hero} playtime={playtime} />);

    const heroNameElement = screen.getByText(hero);
    const playtimeElement = screen.getByText(formatDuration(playtime));

    expect(heroNameElement).toBeInTheDocument();
    expect(playtimeElement).toBeInTheDocument();
  });

  it('sets the card width based on playtime', () => {
    render(<HeroCard hero={hero} playtime={playtime} />);

    const cardElement = screen.getByTestId('data-card');
    const expectedWidth = 60 + Math.sqrt(playtime) * 4;
    expect(cardElement.style.width).toBe(`${expectedWidth}px`);
  });

  it('displays the hero image', () => {
    render(<HeroCard hero={hero} playtime={playtime} />);
    const imageElement = screen.getByRole('img');
    expect(imageElement).toHaveAttribute('src', `/assets/heroes/${hero.toLowerCase()}.png`);
  });
});