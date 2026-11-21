import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { site, type SiteData } from '../data/site';
import { axe } from '../test/axe';
import { BioPage } from './bio';

const renderBio = (data?: SiteData) =>
	render(
		<MemoryRouter>
			<BioPage data={data} />
		</MemoryRouter>,
	);

const contact = () => within(screen.getByRole('list', { name: /contact/i }));

describe('BioPage', () => {
	it('has the name as the one h1', () => {
		renderBio();

		expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
		expect(screen.getByRole('heading', { level: 1, name: site.name })).toBeInTheDocument();
	});

	it('shows the headshot with alt text and a fixed size', () => {
		renderBio();
		const photo = screen.getByRole('img', { name: site.headshot.alt });

		expect(photo).toHaveAttribute('width', String(site.headshot.width));
		expect(photo).toHaveAttribute('height', String(site.headshot.height));
	});

	it('shows the business and personal sections, each under a heading for screen readers', () => {
		renderBio();

		expect(screen.getByText(site.business)).toBeInTheDocument();
		expect(screen.getByText(site.personal)).toBeInTheDocument();
		expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
	});

	it('lists email, LinkedIn, GitHub, and the resume as contact links', () => {
		renderBio();

		expect(contact().getByRole('link', { name: /email/i })).toHaveAttribute('href', `mailto:${site.email}`);
		expect(contact().getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', site.linkedin);
		expect(contact().getByRole('link', { name: /github/i })).toHaveAttribute('href', site.github);
		expect(contact().getByRole('link', { name: /resume \(pdf\)/i })).toHaveAttribute('href', site.resume.href);
	});

	it('opens external profiles in a new tab, safely, and says so', () => {
		renderBio();
		const github = contact().getByRole('link', { name: /github/i });

		expect(github).toHaveAttribute('target', '_blank');
		expect(github).toHaveAttribute('rel', 'noopener noreferrer');
		expect(github).toHaveAccessibleName(/opens in new tab/i);
	});

	it.each([undefined, 'coming soon', 'javascript:alert(1)', 'http://insecure.example.com'])(
		'hides Substack when its value is %j',
		(substack) => {
			renderBio({ ...site, substack });

			expect(contact().queryByRole('link', { name: /substack/i })).not.toBeInTheDocument();
		},
	);

	it('shows Substack once it is a real https URL', () => {
		renderBio({ ...site, substack: 'https://example.substack.com' });

		expect(contact().getByRole('link', { name: /substack/i })).toHaveAttribute('href', 'https://example.substack.com');
	});

	it('has no accessibility violations', async () => {
		const { container } = renderBio({ ...site, substack: 'https://example.substack.com' });

		expect(await axe(container)).toHaveNoViolations();
	});
});
