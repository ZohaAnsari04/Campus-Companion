import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PillNav from './PillNav';

describe('PillNav Component', () => {
  const items = [
    { id: 'item-home', label: 'Home', href: '#home' },
    { id: 'item-tasks', label: 'Tasks', href: '#tasks' },
    { id: 'item-about', label: 'About', href: '#about' },
  ];

  it('renders all nav items with correct labels and hrefs', () => {
    render(<PillNav items={items} activeHref="#home" />);

    expect(screen.getAllByText('Home').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Tasks').length).toBeGreaterThan(0);
    expect(screen.getAllByText('About').length).toBeGreaterThan(0);

    const homeLink = screen.getByRole('link', { name: 'Home' });
    expect(homeLink).toHaveAttribute('href', '#home');
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('calls onItemClick when an item is clicked', () => {
    const handleClick = vi.fn();
    render(<PillNav items={items} activeHref="#home" onItemClick={handleClick} />);

    const aboutLink = screen.getByRole('link', { name: 'About' });
    fireEvent.click(aboutLink);

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(items[2], 2, expect.any(Object));
  });

  it('renders logo when provided', () => {
    render(
      <PillNav
        logo={<span data-testid="custom-logo">CC</span>}
        logoAlt="Campus Companion Logo"
        logoHref="#home"
        items={items}
      />
    );

    expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    const logoLink = screen.getByRole('link', { name: 'Campus Companion Logo' });
    expect(logoLink).toHaveAttribute('href', '#home');
  });

  it('renders items without href as buttons', () => {
    const buttonItems = [
      { id: 'btn-1', label: 'Action One' },
      { id: 'btn-2', label: 'Action Two' },
    ];
    render(<PillNav items={buttonItems} />);

    expect(screen.getByRole('button', { name: 'Action One' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Action Two' })).toBeInTheDocument();
  });

  it('supports collapsed mode with toggle button and mobile panel', () => {
    const onToggle = vi.fn();
    render(
      <PillNav
        items={items}
        collapse="always"
        onMenuToggle={onToggle}
      />
    );

    // Toggle button should be visible
    const toggleButton = screen.getByRole('button', { name: /Open menu/i });
    expect(toggleButton).toBeInTheDocument();

    // Click toggle to open panel
    fireEvent.click(toggleButton);
    expect(onToggle).toHaveBeenCalledWith(true);

    // Dropdown list should have items
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument();
  });
});
