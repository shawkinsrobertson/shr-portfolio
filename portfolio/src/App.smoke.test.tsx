import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import App from './App';
import { axe } from './test/axe';

const renderApp = (path: string) =>
	render(
		<MemoryRouter initialEntries={[path]}>
			<App />
		</MemoryRouter>,
	);

describe('App', () => {
	it('renders the home route', () => {
		const { container } = renderApp('/');

		expect(container.querySelector('nav')).toBeInTheDocument();
	});

	// Known violations in the current code (SPEC A1 icon-only theme button with no name,
	// A4 skipped heading level). `it.fails` keeps CI green now and turns red the moment
	// they are fixed, which is the cue to change this to a plain `it` (PLAN S0.6/S1.3).
	it.fails('has no accessibility violations on the home route', async () => {
		const { container } = renderApp('/');

		expect(await axe(container)).toHaveNoViolations();
	});
});
