import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import App from './App';
import { axe } from './test/axe';

const renderAt = (path: string) =>
	render(
		<MemoryRouter initialEntries={[path]}>
			<App />
		</MemoryRouter>,
	);

describe('routes', () => {
	it('renders the home page at /', () => {
		renderAt('/');
		expect(screen.getByRole('heading', { level: 1, name: /seamus robertson/i })).toBeInTheDocument();
	});

	it('renders the bio page at /bio with a single h1', () => {
		renderAt('/bio');
		expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
	});

	it('renders a case study at /projects/:slug', () => {
		renderAt('/projects/todo-app');
		expect(screen.getByRole('heading', { name: 'Do Shit' })).toBeInTheDocument();
	});

	it.each(['/nope', '/projects/does-not-exist', '/projects/do-shit', '/pages/bio'])('shows the 404 page at %s', (path) => {
		renderAt(path);

		expect(screen.getByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument();
		expect(within(screen.getByRole('main')).getByRole('link', { name: /home/i })).toBeInTheDocument();
	});

	it('marks the 404 page noindex so search engines skip it', () => {
		renderAt('/nope');
		expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
	});
});

describe('layout', () => {
	it.each(['/', '/bio', '/nope'])('has the page landmarks at %s', (path) => {
		renderAt(path);

		expect(screen.getByRole('banner')).toBeInTheDocument();
		expect(screen.getByRole('navigation')).toBeInTheDocument();
		expect(screen.getAllByRole('main')).toHaveLength(1);
		expect(screen.getByRole('contentinfo')).toBeInTheDocument();
	});

	it('makes the skip link the first tab stop', async () => {
		renderAt('/bio');
		await userEvent.tab();

		expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveFocus();
	});

	it('moves focus to the main content when the skip link is used', async () => {
		renderAt('/bio');
		await userEvent.tab();
		await userEvent.keyboard('{Enter}');

		expect(screen.getByRole('main')).toHaveFocus();
	});

	it('moves focus to main after navigating to another page', async () => {
		renderAt('/');
		await userEvent.click(within(screen.getByRole('navigation')).getByRole('link', { name: 'Bio' }));

		expect(screen.getByRole('heading', { level: 1, name: /seamus robertson/i })).toBeInTheDocument();
		expect(screen.getByRole('main')).toHaveFocus();
	});

	it.each(['/bio', '/nope'])('has no accessibility violations at %s', async (path) => {
		const { container } = renderAt(path);
		expect(await axe(container)).toHaveNoViolations();
	});
});
