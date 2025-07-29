import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './Homepage';

describe('HomePage Component', () => {
  // Test for rendering
  it('renders without crashing', () => {
    render(<HomePage />);
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });

  // Test for content accuracy
  it('displays the correct content', () => {
    render(<HomePage />);
    
    // Check for main heading
    expect(screen.getByRole('heading', { name: /Home Page/i })).toBeInTheDocument();
    
    // Check for paragraph text
    expect(screen.getByText(/This is the Home page/i)).toBeInTheDocument();
  });

  // Test for styling (basic check)
  it('has correct basic styling', () => {
    const { container } = render(<HomePage />);
    const divElement = container.firstChild;
    
    expect(divElement).toHaveStyle('textAlign: center');
    expect(divElement).toHaveStyle('marginTop: 400px');
  });

  // Snapshot test for unexpected changes
  it('matches snapshot', () => {
    const { asFragment } = render(<HomePage />);
    expect(asFragment()).toMatchSnapshot();
  });
});