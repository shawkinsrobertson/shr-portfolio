import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { STORAGE_KEY } from '../../lib/theme';
import { ThemeToggle } from './ThemeToggle';

afterEach(() => {
	localStorage.clear();
	document.documentElement.removeAttribute('data-theme');
});

describe('ThemeToggle', () => {
	it('reflects the theme already applied to the page (e.g. dark from the OS)', () => {
		document.documentElement.dataset.theme = 'dark';
		render(<ThemeToggle />);

		expect(screen.getByRole('button', { name: /switch to light theme/i })).toBeInTheDocument();
	});

	it('switches theme on the first click, not the second', async () => {
		document.documentElement.dataset.theme = 'dark';
		render(<ThemeToggle />);

		await userEvent.click(screen.getByRole('button', { name: /switch to light theme/i }));

		expect(document.documentElement.dataset.theme).toBe('light');
		expect(screen.getByRole('button', { name: /switch to dark theme/i })).toBeInTheDocument();
	});

	it('remembers the choice', async () => {
		document.documentElement.dataset.theme = 'light';
		render(<ThemeToggle />);

		await userEvent.click(screen.getByRole('button', { name: /switch to dark theme/i }));

		expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
	});
});
