import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { site } from '../../data/site';
import { axe } from '../../test/axe';
import { Footer } from './Footer';

describe('Footer', () => {
	it('shows the current year and the name', () => {
		vi.useFakeTimers({ toFake: ['Date'] });
		vi.setSystemTime(new Date('2031-06-01'));
		render(<Footer />);
		vi.useRealTimers();

		expect(screen.getByText(/2031/)).toHaveTextContent(site.name);
	});

	it('links to email, LinkedIn, and GitHub with text, not just icons', () => {
		render(<Footer />);
		const contact = within(screen.getByRole('list', { name: /contact/i }));

		expect(contact.getByRole('link', { name: /email/i })).toHaveAttribute('href', `mailto:${site.email}`);
		expect(contact.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', site.linkedin);
		expect(contact.getByRole('link', { name: /github/i })).toHaveAttribute('href', site.github);
	});

	it('links to the resume PDF', () => {
		render(<Footer />);

		expect(screen.getByRole('link', { name: /resume \(pdf\)/i })).toHaveAttribute('href', site.resume.href);
	});

	it('opens external links safely and announces the new tab', () => {
		render(<Footer />);
		const github = screen.getByRole('link', { name: /github/i });

		expect(github).toHaveAttribute('target', '_blank');
		expect(github).toHaveAttribute('rel', expect.stringContaining('noopener'));
		expect(github).toHaveAccessibleName(/opens in new tab/i);
	});

	it('has no accessibility violations', async () => {
		const { container } = render(<Footer />);
		expect(await axe(container)).toHaveNoViolations();
	});
});
