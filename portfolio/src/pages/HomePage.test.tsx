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

	it('lists every published project as one card with a badge, under a single h2', () => {
		renderHome();
		const main = within(screen.getByRole('main'));
		const published = getPublishedProjects();

		expect(main.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Selected projects']);
		expect(main.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(published.map((p) => p.title));
		for (const project of published) {
			const card = main.getByRole('heading', { level: 3, name: project.title }).closest('article')!;
			expect(within(card).getByText(project.agentic ? 'Agentic' : 'Hand-coded')).toBeInTheDocument();
		}
	});

	it('presents the cards as a list so a screen reader announces how many there are', () => {
		renderHome();
		const list = screen.getByRole('list', { name: /projects/i });

		// Direct items only: each card also contains its own stack list.
		const cards = within(list).getAllByRole('listitem').filter((li) => li.parentElement === list);

		expect(cards).toHaveLength(getPublishedProjects().length);
	});
});
