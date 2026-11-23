import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STORAGE_KEY } from '../../lib/theme';
import { axe } from '../../test/axe';
import { ThemeSwitcher } from './ThemeSwitcher';

// jsdom has no matchMedia; this one lets a test flip the OS preference and fire the change event.
function mockOsPreference(prefersDark: boolean) {
	const listeners = new Set<() => void>();
	const mq = {
		matches: prefersDark,
		addEventListener: (_: string, fn: () => void) => listeners.add(fn),
		removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
	};
	window.matchMedia = (() => mq) as unknown as typeof window.matchMedia;
	return {
		change(next: boolean) {
			mq.matches = next;
			act(() => listeners.forEach((fn) => fn()));
		},
	};
}

const trigger = () => screen.getByRole('button', { name: /theme/i });
const theme = () => document.documentElement.dataset.theme;

beforeEach(() => {
	mockOsPreference(false);
});

afterEach(() => {
	localStorage.clear();
	document.documentElement.removeAttribute('data-theme');
});

describe('ThemeSwitcher', () => {
	it('names the button with the current theme and starts collapsed', () => {
		document.documentElement.dataset.theme = 'dark';
		render(<ThemeSwitcher />);

		expect(trigger()).toHaveAccessibleName(/dark/i);
		expect(trigger()).toHaveAttribute('aria-expanded', 'false');
		expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
	});

	it('opens on click and offers only enabled themes, with the current one checked', async () => {
		document.documentElement.dataset.theme = 'dark';
		render(<ThemeSwitcher />);
		await userEvent.click(trigger());

		expect(trigger()).toHaveAttribute('aria-expanded', 'true');
		expect(screen.getAllByRole('radio').map((r) => r.closest('label')?.textContent)).toEqual(['Light', 'Dark', 'Opossum']);
		expect(screen.queryByRole('radio', { name: /glass/i })).not.toBeInTheDocument();
		expect(screen.getByRole('radio', { name: 'Dark' })).toBeChecked();
	});

	it('applies and remembers the opossum theme', async () => {
		document.documentElement.dataset.theme = 'dark';
		render(<ThemeSwitcher />);
		await userEvent.click(trigger());
		await userEvent.click(screen.getByRole('radio', { name: 'Opossum' }));

		expect(theme()).toBe('opossum');
		expect(localStorage.getItem(STORAGE_KEY)).toBe('opossum');
	});

	it('applies, remembers, and relabels on the first selection', async () => {
		document.documentElement.dataset.theme = 'dark';
		render(<ThemeSwitcher />);
		await userEvent.click(trigger());
		await userEvent.click(screen.getByRole('radio', { name: 'Light' }));

		expect(theme()).toBe('light');
		expect(localStorage.getItem(STORAGE_KEY)).toBe('light');
		expect(trigger()).toHaveAccessibleName(/light/i);
	});

	it('moves focus to the checked option when opened with the keyboard', async () => {
		document.documentElement.dataset.theme = 'dark';
		render(<ThemeSwitcher />);
		trigger().focus();
		await userEvent.keyboard('{Enter}');

		expect(screen.getByRole('radio', { name: 'Dark' })).toHaveFocus();
	});

	it('changes theme with the arrow keys', async () => {
		document.documentElement.dataset.theme = 'dark';
		render(<ThemeSwitcher />);
		trigger().focus();
		await userEvent.keyboard('{Enter}{ArrowUp}');

		expect(screen.getByRole('radio', { name: 'Light' })).toBeChecked();
		expect(theme()).toBe('light');
	});

	it('closes on Escape and returns focus to the button', async () => {
		render(<ThemeSwitcher />);
		trigger().focus();
		await userEvent.keyboard('{Enter}{Escape}');

		expect(trigger()).toHaveAttribute('aria-expanded', 'false');
		expect(trigger()).toHaveFocus();
	});

	it('closes when clicking elsewhere', async () => {
		render(<ThemeSwitcher />);
		await userEvent.click(trigger());
		await userEvent.click(document.body);

		expect(trigger()).toHaveAttribute('aria-expanded', 'false');
	});

	it('follows the OS preference while nothing is stored', () => {
		const os = mockOsPreference(false);
		render(<ThemeSwitcher />);
		os.change(true);

		expect(theme()).toBe('dark');
	});

	it('stops following the OS once a theme has been chosen', async () => {
		const os = mockOsPreference(false);
		render(<ThemeSwitcher />);
		await userEvent.click(trigger());
		await userEvent.click(screen.getByRole('radio', { name: 'Light' }));
		os.change(true);

		expect(theme()).toBe('light');
	});

	it('syncs when another tab changes the theme', async () => {
		render(<ThemeSwitcher />);
		await act(async () => {
			window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: 'dark' }));
		});

		expect(theme()).toBe('dark');
		expect(trigger()).toHaveAccessibleName(/dark/i);
	});

	it('ignores an invalid value from another tab', () => {
		mockOsPreference(false);
		render(<ThemeSwitcher />);
		act(() => {
			window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY, newValue: '<img onerror=x>' }));
		});

		expect(theme()).toBe('light');
	});

	it('does not crash when storage is blocked', async () => {
		vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
			throw new Error('blocked');
		});
		render(<ThemeSwitcher />);
		await userEvent.click(trigger());
		await userEvent.click(screen.getByRole('radio', { name: 'Dark' }));

		expect(theme()).toBe('dark');
		vi.restoreAllMocks();
	});

	it.each(['closed', 'open'])('has no accessibility violations when %s', async (state) => {
		const { container } = render(<ThemeSwitcher />);
		if (state === 'open') await userEvent.click(trigger());

		expect(await axe(container)).toHaveNoViolations();
	});
});
