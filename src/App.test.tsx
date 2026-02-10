import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';
import { AppProvider } from './context/AppContext';

describe('App', () => {
  it('renders the app header', () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    expect(screen.getByRole('heading', { name: /window/i })).toBeInTheDocument();
  });

  it('displays the tagline', () => {
    render(
      <AppProvider>
        <App />
      </AppProvider>
    );
    expect(screen.getByText(/plan your day!/i)).toBeInTheDocument();
  });
});
