import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';
import PeopleIcon from '@mui/icons-material/People';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe('StatCard', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('renders with title and value', () => {
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
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
    renderWithProviders(
      <StatCard
        title="Orders"
        value="100"
        icon={<PeopleIcon />}
        trend={0}
      />
    );

    expect(screen.getByText('ไม่เปลี่ยนแปลง')).toBeInTheDocument();
  });

  it('renders without trend when not provided', () => {
    renderWithProviders(
      <StatCard
        title="Products"
        value="500"
        icon={<PeopleIcon />}
      />
    );

    expect(screen.queryByText(/จากเดือนที่แล้ว/)).not.toBeInTheDocument();
  });
});
