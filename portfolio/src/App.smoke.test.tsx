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

	it('has no accessibility violations on the home route', async () => {
		const { container } = renderApp('/');

		expect(await axe(container)).toHaveNoViolations();
	});
});
