import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import App from '../App';
import { getPublishedProjects, type Project } from '../lib/projects';
import { axe } from '../test/axe';
import { CaseStudyView } from './CaseStudyPage';

const project: Project = {
	slug: 'sample-app',
	title: 'Sample App',
	tagline: 'A sample',
	description: 'Describes the sample app.',
	agentic: false,
	stack: ['React', 'TypeScript'],
	role: 'Solo Developer',
	platform: 'Web',
	status: 'v1 complete',
	achievement: 'Top 100 at a hackathon',
	order: 10,
	draft: false,
	image: { file: 'feature-01.png', alt: 'The sample home screen', width: 3200, height: 1800 },
	links: { repo: 'https://github.com/example/sample', live: 'https://sample.example.com' },
};

const Body = () => <p>Body text</p>;

const renderView = (props: Partial<Parameters<typeof CaseStudyView>[0]> = {}) =>
	render(
		<MemoryRouter>
			<CaseStudyView project={project} Body={Body} {...props} />
		</MemoryRouter>,
	);

describe('CaseStudyView', () => {
	it('makes the title the page h1', () => {
		renderView();

		expect(screen.getByRole('heading', { level: 1, name: 'Sample App' })).toBeInTheDocument();
		expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
	});

	it('shows the description, award, and the MDX body', () => {
		renderView();

		expect(screen.getByText('Describes the sample app.')).toBeInTheDocument();
		expect(screen.getByText(/top 100 at a hackathon/i)).toBeInTheDocument();
		expect(screen.getByText('Body text')).toBeInTheDocument();
	});

	it('presents the key facts as a description list', () => {
		const { container } = renderView();
		const facts = Object.fromEntries(
			[...container.querySelectorAll('dl dt')].map((dt) => [dt.textContent, dt.nextElementSibling?.textContent]),
		);

		expect(facts).toEqual({
			Stack: 'React, TypeScript',
			Platform: 'Web',
			Role: 'Solo Developer',
			Status: 'v1 complete',
		});
	});

	it('leaves out Status when there is none', () => {
		const { container } = renderView({ project: { ...project, status: undefined } });

		expect([...container.querySelectorAll('dl dt')].map((dt) => dt.textContent)).not.toContain('Status');
	});

	it('shows the header image with its alt text and size', () => {
		renderView();
		const img = screen.getByRole('img', { name: 'The sample home screen' });

		expect(img).toHaveAttribute('width', '3200');
		expect(img).toHaveAttribute('height', '1800');
	});

	it('links to the repo and live site safely, in a new tab', () => {
		renderView();
		const repo = screen.getByRole('link', { name: /source code/i });
		const live = screen.getByRole('link', { name: /live site/i });

		expect(repo).toHaveAttribute('href', 'https://github.com/example/sample');
		expect(live).toHaveAttribute('href', 'https://sample.example.com');
		for (const link of [repo, live]) {
			expect(link).toHaveAttribute('target', '_blank');
			expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		}
	});

	it('shows no external links when the project has none', () => {
		renderView({ project: { ...project, links: undefined } });

		expect(screen.queryByRole('link', { name: /source code|live site/i })).not.toBeInTheDocument();
	});

	it('links to the previous and next projects, and back to all projects', () => {
		const prev = { ...project, slug: 'older', title: 'Older App' };
		const next = { ...project, slug: 'newer', title: 'Newer App' };
		renderView({ prev, next });
		const nav = screen.getByRole('navigation', { name: /more projects/i });

		expect(within(nav).getByRole('link', { name: /previous: older app/i })).toHaveAttribute('href', '/projects/older');
		expect(within(nav).getByRole('link', { name: /next: newer app/i })).toHaveAttribute('href', '/projects/newer');
		expect(within(nav).getByRole('link', { name: /all projects/i })).toHaveAttribute('href', '/');
	});

	it('reads Previous, Next, then All projects, matching the two-column layout', () => {
		renderView({
			prev: { ...project, slug: 'older', title: 'Older App' },
			next: { ...project, slug: 'newer', title: 'Newer App' },
		});
		const nav = screen.getByRole('navigation', { name: /more projects/i });

		expect(within(nav).getAllByRole('link').map((a) => a.textContent?.replace(/[←→]/g, '').trim())).toEqual([
			'Previous: Older App',
			'Next: Newer App',
			'All projects',
		]);
	});

	it('never renders an empty list item for a missing neighbour', () => {
		renderView({ next: { ...project, slug: 'newer', title: 'Newer App' } });
		const nav = screen.getByRole('navigation', { name: /more projects/i });

		expect(within(nav).getAllByRole('listitem')).toHaveLength(2);
		for (const item of within(nav).getAllByRole('listitem')) expect(item).not.toBeEmptyDOMElement();
	});

	it('omits Previous at the start and Next at the end', () => {
		renderView({ next: { ...project, slug: 'newer', title: 'Newer App' } });
		const nav = screen.getByRole('navigation', { name: /more projects/i });

		expect(within(nav).queryByRole('link', { name: /previous/i })).not.toBeInTheDocument();
		expect(within(nav).getByRole('link', { name: /next/i })).toBeInTheDocument();
	});

	it('has no accessibility violations', async () => {
		const { container } = renderView({
			prev: { ...project, slug: 'older', title: 'Older App' },
			next: { ...project, slug: 'newer', title: 'Newer App' },
		});

		expect(await axe(container)).toHaveNoViolations();
	});
});

describe('case study route', () => {
	const published = getPublishedProjects();
	const at = (slug: string) =>
		render(
			<MemoryRouter initialEntries={[`/projects/${slug}`]}>
				<App />
			</MemoryRouter>,
		);

	it.each(published.map((p) => [p.slug, p.title]))('/projects/%s has one h1 and no skipped heading levels', (slug, title) => {
		at(slug);
		const levels = screen.getAllByRole('heading').map((h) => Number(h.tagName.slice(1)));

		expect(screen.getByRole('heading', { level: 1, name: title })).toBeInTheDocument();
		expect(levels.filter((l) => l === 1)).toHaveLength(1);
		levels.slice(1).forEach((level, i) => expect(level - levels[i]).toBeLessThanOrEqual(1));
	});

	it('shows Next but not Previous on the first project, and the reverse on the last', () => {
		const first = at(published[0].slug);
		const firstNav = within(screen.getByRole('navigation', { name: /more projects/i }));
		expect(firstNav.queryByRole('link', { name: /previous/i })).not.toBeInTheDocument();
		expect(firstNav.getByRole('link', { name: new RegExp(`next: ${published[1].title}`, 'i') })).toBeInTheDocument();
		first.unmount();

		at(published[published.length - 1].slug);
		const lastNav = within(screen.getByRole('navigation', { name: /more projects/i }));
		expect(lastNav.queryByRole('link', { name: /next/i })).not.toBeInTheDocument();
		expect(lastNav.getByRole('link', { name: /previous/i })).toBeInTheDocument();
	});

	it('renders Shelby\'s "What I Did" as two titled decisions, each with a trade-off callout', () => {
		const { container } = at('shelby');
		const decisions = [...container.querySelectorAll('.decision')];

		expect(decisions).toHaveLength(2);
		for (const decision of decisions) {
			const note = within(decision as HTMLElement).getByRole('note');
			expect(note).toHaveTextContent('Trade-off');
			expect(note.textContent?.replace('Trade-off', '').trim().length).toBeGreaterThan(20);
		}
		expect(within(decisions[0] as HTMLElement).getByRole('heading', { level: 3 })).toHaveTextContent(
			'CGM ingestion via local inter-app broadcast',
		);
		expect(within(decisions[1] as HTMLElement).getByRole('heading', { level: 3 })).toHaveTextContent(
			'Flat basal insulin calculation',
		);
	});

	it('has no accessibility violations on a real case study', async () => {
		const { container } = at(published[0].slug);

		expect(await axe(container)).toHaveNoViolations();
	});
});
