
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RoleCard from './RoleCard';
import { formatDuration } from '../lib/format';
import { Role } from '../lib/ScrimsightDataModel';

describe('RoleCard', () => {
  const role = 'tank' as Role;
  const playtime = 3600; // 1 hour

  it('renders the role card with the correct role name and playtime', () => {
    render(<RoleCard role={role} playtime={playtime} />);

    const roleNameElement = screen.getByText(role);
    const playtimeElement = screen.getByText(formatDuration(playtime));

    expect(roleNameElement).toBeInTheDocument();
    expect(playtimeElement).toBeInTheDocument();
  });

  it('sets the card width based on playtime', () => {
    render(<RoleCard role={role} playtime={playtime} />);

    const cardElement = screen.getByTestId('data-card');
    const expectedWidth = 60 + Math.sqrt(playtime) * 4;
    expect(cardElement).toHaveStyle(`width: ${expectedWidth}px`);
  });

  it('displays the role icon', () => {
    render(<RoleCard role={role} playtime={playtime} />);
    const roleIconElement = screen.getByTestId('role-icon');
    expect(roleIconElement).toBeInTheDocument();
  });
});
