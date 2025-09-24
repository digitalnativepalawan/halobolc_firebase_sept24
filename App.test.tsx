import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App', () => {
  it('renders the Home component', () => {
    render(<App />);
    expect(screen.getByText('Financial Overview')).toBeInTheDocument();
  });
});
