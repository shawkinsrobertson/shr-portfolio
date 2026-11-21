import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { axe } from '../../test/axe';
import { ProjectCard, type ProjectCardProps } from './ProjectCard';

const base: ProjectCardProps = {
	title: 'Shelby',
	tagline: 'A modern diabetes assistant for MDI',
	description: 'An AI-integrated treatment logger.',
	stack: ['TypeScript', 'React Native'],
	role: 'Agentic SDLC',
	href: '/projects/shelby',
	agentic: true,
};

const renderCard = (props: Partial<ProjectCardProps> = {}) =>
	render(
		<MemoryRouter>
			<ProjectCard {...base} {...props} />
		</MemoryRouter>,
	);

describe('ProjectCard', () => {
	it('is an article whose h3 holds the one link, so the link name is just the title', () => {
		renderCard();
		const card = screen.getByRole('article');
		const heading = within(card).getByRole('heading', { level: 3 });

		expect(within(card).getAllByRole('link')).toHaveLength(1);
		expect(within(heading).getByRole('link', { name: 'Shelby' })).toHaveAttribute('href', '/projects/shelby');
	});

	it.each([
		[true, 'Agentic'],
		[false, 'Hand-coded'],
	])('shows the badge text when agentic is %s', (agentic, label) => {
		renderCard({ agentic });

		expect(within(screen.getByRole('article')).getByText(label)).toBeInTheDocument();
	});

	it('shows the tagline, description, and role', () => {
		renderCard();

		expect(screen.getByText(base.tagline)).toBeInTheDocument();
		expect(screen.getByText(base.description)).toBeInTheDocument();
		expect(screen.getByText('Agentic SDLC')).toBeInTheDocument();
	});

	it('lists the stack as a labelled list', () => {
		renderCard();
		const stack = screen.getByRole('list', { name: /tech stack/i });

		expect(within(stack).getAllByRole('listitem').map((li) => li.textContent)).toEqual(['TypeScript', 'React Native']);
	});

	it('omits the stack list when there is no stack', () => {
		renderCard({ stack: [] });

		expect(screen.queryByRole('list')).not.toBeInTheDocument();
	});

	it('shows an achievement only when there is one', () => {
		const { unmount } = renderCard({ achievement: 'Top 100 at Kanz AI Hackathon' });
		expect(screen.getByText('Top 100 at Kanz AI Hackathon')).toBeInTheDocument();
		unmount();
		renderCard();

		expect(screen.queryByText(/hackathon/i)).not.toBeInTheDocument();
	});

	it('never hides content behind hover (touch and keyboard cannot hover)', () => {
		const { container } = renderCard();

		expect(container.querySelector('img')).not.toBeInTheDocument();
	});

	it('has no accessibility violations', async () => {
		const { container } = renderCard({ achievement: 'Top 100' });

		expect(await axe(container)).toHaveNoViolations();
	});
});
