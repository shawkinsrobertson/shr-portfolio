import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import App from './../App';
import { getPublishedProjects } from '../lib/projects';

const renderHome = () =>
	render(
		<MemoryRouter initialEntries={['/']}>
			<App />
		</MemoryRouter>,
	);

describe('HomePage', () => {
	it('has exactly one h1, the name', () => {
		renderHome();
		const h1s = screen.getAllByRole('heading', { level: 1 });

		expect(h1s).toHaveLength(1);
		expect(h1s[0]).toHaveTextContent('Seamus Robertson');
	});

	it('never skips a heading level', () => {
		renderHome();
		const levels = screen
			.getAllByRole('heading')
			.map((h) => Number(h.tagName.slice(1)));

		expect(levels[0]).toBe(1);
		levels.slice(1).forEach((level, i) => {
			expect(level - levels[i], `h${levels[i]} followed by h${level}`).toBeLessThanOrEqual(1);
		});
	});

	it('titles each project section with an h2 and each card with an h3', () => {
		renderHome();
		const main = within(screen.getByRole('main'));
		const sectionTitles = main.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);

		expect(sectionTitles).toEqual(expect.arrayContaining(['Hand Coded', 'Agentic']));
		const published = getPublishedProjects();
		expect(main.getAllByRole('heading', { level: 3 })).toHaveLength(published.length);
	});
});
