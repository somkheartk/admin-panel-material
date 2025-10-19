import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/lib/i18n/LanguageContext';

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

// Test component that uses the language context
const TestComponent = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span data-testid="current-lang">{language}</span>
      <span data-testid="translated-text">{t('common.dashboard')}</span>
      <button onClick={() => setLanguage('en')}>Switch to English</button>
      <button onClick={() => setLanguage('th')}>Switch to Thai</button>
    </div>
  );
};

describe('LanguageContext', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('provides default language as Thai', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('current-lang')).toHaveTextContent('th');
  });

  it('translates text correctly in Thai', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('translated-text')).toHaveTextContent('แดชบอร์ด');
  });

  it('switches language to English', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    const switchButton = screen.getByText('Switch to English');
    fireEvent.click(switchButton);
    
    expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
    expect(screen.getByTestId('translated-text')).toHaveTextContent('Dashboard');
  });

  it('persists language to localStorage', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    const switchButton = screen.getByText('Switch to English');
    fireEvent.click(switchButton);
    
    expect(localStorageMock.getItem('language')).toBe('en');
  });

  it('loads language from localStorage on mount', () => {
    localStorageMock.setItem('language', 'en');
    
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    
    // Wait for useEffect to run
    waitFor(() => {
      expect(screen.getByTestId('current-lang')).toHaveTextContent('en');
      expect(screen.getByTestId('translated-text')).toHaveTextContent('Dashboard');
    });
  });

  it('returns key if translation not found', () => {
    const TestComponentWithBadKey = () => {
      const { t } = useLanguage();
      return <span data-testid="bad-key">{t('nonexistent.key')}</span>;
    };

    render(
      <LanguageProvider>
        <TestComponentWithBadKey />
      </LanguageProvider>
    );
    
    expect(screen.getByTestId('bad-key')).toHaveTextContent('nonexistent.key');
  });
});
