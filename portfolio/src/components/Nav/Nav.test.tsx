import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { caseStudies, getCaseStudySlug, hasLongFormContent } from '../../data/CaseStudies';
import { axe } from '../../test/axe';
import { Nav } from './Nav';

const published = caseStudies.filter(hasLongFormContent);

function Where() {
	return <p data-testid="where">{useLocation().pathname}</p>;
}

const renderNav = (path = '/') =>
	render(
		<MemoryRouter initialEntries={[path]}>
			<Nav />
			<Routes>
				<Route path="*" element={<Where />} />
			</Routes>
		</MemoryRouter>,
	);

const projectsButton = () => screen.getByRole('button', { name: 'Projects' });

afterEach(() => {
	document.documentElement.style.removeProperty('--header-h');
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe('Nav', () => {
	it('is a labelled navigation landmark with Home and Bio links', () => {
		renderNav();
		const nav = screen.getByRole('navigation', { name: /primary/i });

		expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
		expect(within(nav).getByRole('link', { name: 'Bio' })).toHaveAttribute('href', '/bio');
	});

	it('makes Projects a button, not a link to "#"', () => {
		renderNav();

		expect(screen.queryByRole('link', { name: 'Projects' })).not.toBeInTheDocument();
		expect(projectsButton()).toHaveAttribute('aria-expanded', 'false');
	});

	it('hides the project list until opened', () => {
		renderNav();

		for (const study of published) {
			expect(screen.queryByRole('link', { name: study.title })).not.toBeInTheDocument();
		}
	});

	it('lists every published study with its /projects/ link when opened', async () => {
		renderNav();
		await userEvent.click(projectsButton());

		expect(projectsButton()).toHaveAttribute('aria-expanded', 'true');
		for (const study of published) {
			expect(screen.getByRole('link', { name: study.title })).toHaveAttribute(
				'href',
				`/projects/${getCaseStudySlug(study.title)}`,
			);
		}
	});

	it.each([['Enter', '{Enter}'], ['Space', ' ']])('opens with the %s key', async (_name, key) => {
		renderNav();
		projectsButton().focus();
		await userEvent.keyboard(key);

		expect(projectsButton()).toHaveAttribute('aria-expanded', 'true');
	});

	it('does not open on hover (touch has no hover)', async () => {
		renderNav();
		await userEvent.hover(projectsButton());

		expect(projectsButton()).toHaveAttribute('aria-expanded', 'false');
	});

	it('closes on Escape and returns focus to the button', async () => {
		renderNav();
		await userEvent.click(projectsButton());
		await userEvent.keyboard('{Escape}');

		expect(projectsButton()).toHaveAttribute('aria-expanded', 'false');
		expect(projectsButton()).toHaveFocus();
	});

	it('closes when clicking elsewhere', async () => {
		renderNav();
		await userEvent.click(projectsButton());
		await userEvent.click(document.body);

		expect(projectsButton()).toHaveAttribute('aria-expanded', 'false');
	});

	it('closes when keyboard focus tabs out of the list', async () => {
		renderNav();
		projectsButton().focus();
		await userEvent.keyboard('{Enter}');
		for (let i = 0; i <= published.length; i++) await userEvent.tab();

		expect(screen.getByRole('link', { name: 'Bio' })).toHaveFocus();
		expect(projectsButton()).toHaveAttribute('aria-expanded', 'false');
	});

	it('closes after navigating to a project', async () => {
		renderNav();
		await userEvent.click(projectsButton());
		await userEvent.click(screen.getByRole('link', { name: published[0].title }));

		expect(screen.getByTestId('where')).toHaveTextContent(`/projects/${getCaseStudySlug(published[0].title)}`);
		expect(projectsButton()).toHaveAttribute('aria-expanded', 'false');
	});

	it.each([
		['/', 'Home', 'Bio'],
		['/bio', 'Bio', 'Home'],
	])('marks the current page at %s', (path, current, other) => {
		renderNav(path);

		expect(screen.getByRole('link', { name: current })).toHaveAttribute('aria-current', 'page');
		expect(screen.getByRole('link', { name: other })).not.toHaveAttribute('aria-current');
	});

	it.each(['closed', 'open'])('has no accessibility violations when %s', async (state) => {
		const { container } = renderNav();
		if (state === 'open') await userEvent.click(projectsButton());

		expect(await axe(container)).toHaveNoViolations();
	});
});

describe('Nav --header-h', () => {
	it('publishes the header height so focused content is never hidden under it', () => {
		vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(72);
		renderNav();

		expect(document.documentElement.style.getPropertyValue('--header-h')).toBe('72px');
	});

	it('keeps it current as the header resizes, and stops observing on unmount', () => {
		let notify: () => void = () => {};
		const disconnect = vi.fn();
		const observe = vi.fn();
		vi.stubGlobal(
			'ResizeObserver',
			class {
				constructor(callback: () => void) {
					notify = callback;
				}
				observe = observe;
				disconnect = disconnect;
			},
		);
		const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(64);
		const { unmount } = renderNav();
		expect(observe).toHaveBeenCalledWith(screen.getByRole('banner'));

		height.mockReturnValue(180); // e.g. the in-flow project list opened on a phone
		act(() => notify());
		expect(document.documentElement.style.getPropertyValue('--header-h')).toBe('180px');

		unmount();
		expect(disconnect).toHaveBeenCalled();
	});
});
