import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';
import PeopleIcon from '@mui/icons-material/People';

describe('StatCard', () => {
  it('renders with title and value', () => {
    render(
      <StatCard
        title="Total Users"
        value="150"
        icon={<PeopleIcon />}
      />
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('displays positive trend correctly', () => {
    render(
      <StatCard
        title="Sales"
        value="$50,000"
        icon={<PeopleIcon />}
        trend={12.5}
      />
    );

    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('displays negative trend correctly', () => {
    render(
      <StatCard
        title="Returns"
        value="25"
        icon={<PeopleIcon />}
        trend={-5.3}
      />
    );

    expect(screen.getByText('-5.3%')).toBeInTheDocument();
  });

  it('displays no change when trend is 0', () => {
    render(
      <StatCard
        title="Orders"
        value="100"
        icon={<PeopleIcon />}
        trend={0}
      />
    );

    expect(screen.getByText('No change')).toBeInTheDocument();
  });

  it('renders without trend when not provided', () => {
    render(
      <StatCard
        title="Products"
        value="500"
        icon={<PeopleIcon />}
      />
    );

    expect(screen.queryByText(/from last month/)).not.toBeInTheDocument();
  });
});
