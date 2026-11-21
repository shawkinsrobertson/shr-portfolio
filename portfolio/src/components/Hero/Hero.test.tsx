import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { site } from '../../data/site';
import { axe } from '../../test/axe';
import { Hero } from './Hero';

const renderHero = () => render(<Hero name="Seamus Robertson" title="Front-End Developer" tagline="A tagline." />);

describe('Hero', () => {
	it('has the name as the h1 and the role as plain text', () => {
		renderHero();

		expect(screen.getByRole('heading', { level: 1, name: 'Seamus Robertson' })).toBeInTheDocument();
		expect(screen.getByText('Front-End Developer').tagName).toBe('P');
	});

	it('always offers the resume', () => {
		renderHero();
		const resume = screen.getByRole('link', { name: /^download resume$/i });

		expect(resume).toHaveAttribute('href', site.resume.href);
		expect(resume).toHaveAttribute('download');
	});

	it('offers email', () => {
		renderHero();

		expect(screen.getByRole('link', { name: /email me/i })).toHaveAttribute('href', `mailto:${site.email}`);
	});

	it('styles both calls to action as buttons', () => {
		renderHero();

		for (const link of screen.getAllByRole('link')) expect(link).toHaveClass('btn');
	});

	it('has no accessibility violations', async () => {
		const { container } = renderHero();

		expect(await axe(container)).toHaveNoViolations();
	});
});
