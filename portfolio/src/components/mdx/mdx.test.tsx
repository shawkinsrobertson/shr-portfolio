import { evaluate } from '@mdx-js/mdx';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import * as runtime from 'react/jsx-runtime';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from '../../test/axe';
import { mdxComponents } from './mdx-components';

// Compile a snippet of MDX the same way the build does, then render it with our component map.
async function renderMdx(source: string) {
	const { default: Content } = await evaluate(source, { ...runtime, development: false } as never);
	return render(
		<MemoryRouter>
			<Content components={mdxComponents} />
		</MemoryRouter>,
	);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe('headings', () => {
	it('renders ### as h2 and #### as h3 so the page title can be the only h1', async () => {
		await renderMdx('### Section\n\n#### Detail\n\n##### Fine print');

		expect(screen.getByRole('heading', { level: 2, name: 'Section' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 3, name: 'Detail' })).toBeInTheDocument();
		expect(screen.getByRole('heading', { level: 4, name: 'Fine print' })).toBeInTheDocument();
	});
});

describe('links', () => {
	it('opens external links in a new tab, safely, and announces it', async () => {
		await renderMdx('[Oref0](https://github.com/openaps/oref0)');
		const link = screen.getByRole('link', { name: /oref0/i });

		expect(link).toHaveAttribute('href', 'https://github.com/openaps/oref0');
		expect(link).toHaveAttribute('target', '_blank');
		expect(link).toHaveAttribute('rel', 'noopener noreferrer');
		expect(link).toHaveAccessibleName('Oref0 (opens in new tab)');
	});

	it('keeps mailto links in the same tab', async () => {
		await renderMdx('[Email](mailto:me@example.com)');

		expect(screen.getByRole('link', { name: 'Email' })).not.toHaveAttribute('target');
	});

	it('uses the router for internal links', async () => {
		await renderMdx('[Bio](/bio)');

		expect(screen.getByRole('link', { name: 'Bio' })).toHaveAttribute('href', '/bio');
		expect(screen.getByRole('link', { name: 'Bio' })).not.toHaveAttribute('target');
	});

	it.each(['javascript:alert(1)', 'data:text/html;base64,PGI+eDwvYj4=', 'vbscript:x', 'JaVaScRiPt:alert(1)'])(
		'does not render a clickable link for %s',
		async (href) => {
			await renderMdx(`[Click me](<${href}>)`);

			expect(screen.queryByRole('link')).not.toBeInTheDocument();
			expect(screen.getByText('Click me')).toBeInTheDocument();
		},
	);
});

describe('Figure', () => {
	it('renders an image with its alt text, size, and caption', async () => {
		await renderMdx('<Figure file="shelby-dashboard.png" alt="The task list" width={3200} height={1800} caption="Task list" />');
		const figure = screen.getByRole('figure');
		const img = within(figure).getByRole('img', { name: 'The task list' });

		expect(img).toHaveAttribute('width', '3200');
		expect(img).toHaveAttribute('height', '1800');
		expect(img).toHaveAttribute('loading', 'lazy');
		expect(within(figure).getByText('Task list')).toBeInTheDocument();
	});

	it('wraps the image in a browser frame, hiding the decorative bar from screen readers', async () => {
		await renderMdx('<Figure file="shelby-dashboard.png" alt="Desktop builder" width={10} height={10} frame="browser" />');
		const figure = screen.getByRole('figure');

		expect(within(figure).getByRole('img', { name: 'Desktop builder' })).toBeInTheDocument();
		expect(figure.querySelector('.browser-bar')).toHaveAttribute('aria-hidden', 'true');
		expect(figure.querySelectorAll('img')).toHaveLength(1);
	});

	it.each([['missing', ''], ['blank', ' alt="  "'], ['empty', ' alt=""']])(
		'renders nothing, and reports it, when alt is %s',
		async (_name, altAttr) => {
			const error = vi.spyOn(console, 'error').mockImplementation(() => {});
			await renderMdx(`<Figure file="shelby-dashboard.png"${altAttr} width={10} height={10} />`);

			expect(screen.queryByRole('img')).not.toBeInTheDocument();
			expect(error).toHaveBeenCalledWith(expect.stringContaining('alt'));
		},
	);
});

describe('Callout', () => {
	it.each([
		['note', 'Note'],
		['bug', 'Known bug'],
		['learning', 'Lesson learned'],
		['tradeoff', 'Trade-off'],
	])('labels a %s callout with text, not just color', async (type, label) => {
		await renderMdx(`<Callout type="${type}">Body text</Callout>`);
		const callout = screen.getByRole('note');

		expect(within(callout).getByText(label)).toBeInTheDocument();
		expect(within(callout).getByText('Body text')).toBeInTheDocument();
	});

	it('defaults to a note', async () => {
		await renderMdx('<Callout>Hello</Callout>');

		expect(within(screen.getByRole('note')).getByText('Note')).toBeInTheDocument();
	});
});

describe('Decision', () => {
	const source = [
		'<Decision>',
		'**Used a flat basal calculation** instead of per-insulin curves.',
		'<Callout type="tradeoff">Can over- or under-suggest.</Callout>',
		'</Decision>',
		'<Decision>',
		'**Used local broadcast** for CGM data.',
		'</Decision>',
	].join('\n\n');

	it('groups a decision with its trade-off callout', async () => {
		const { container } = await renderMdx(source);
		const [first, second] = container.querySelectorAll('.decision');

		expect(within(first as HTMLElement).getByText(/flat basal calculation/)).toBeInTheDocument();
		expect(within(first as HTMLElement).getByRole('note')).toHaveTextContent('Trade-off');
		expect(within(second as HTMLElement).queryByRole('note')).not.toBeInTheDocument();
	});

	it('is a plain group, not an extra landmark', async () => {
		await renderMdx(source);

		expect(screen.queryByRole('region')).not.toBeInTheDocument();
	});
});

describe('code blocks', () => {
	const source = '```ts\nconst answer: number = 42;\n```';

	it('renders fenced code in a pre', async () => {
		await renderMdx(source);

		expect(screen.getByText(/const answer/)).toBeInTheDocument();
		expect(document.querySelector('pre code')).toBeInTheDocument();
	});

	it('is not a tab stop when it fits', async () => {
		await renderMdx(source);

		expect(document.querySelector('pre')).not.toHaveAttribute('tabindex');
	});

	it('becomes a labelled, focusable region when it overflows', async () => {
		vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(900);
		vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
		await renderMdx(source);
		const region = screen.getByRole('region', { name: /code/i });

		expect(region).toHaveAttribute('tabindex', '0');
	});

	it('leaves inline code alone', async () => {
		await renderMdx('Use `profile.mdiMode` here.');

		expect(screen.getByText('profile.mdiMode').tagName).toBe('CODE');
		expect(document.querySelector('pre')).not.toBeInTheDocument();
	});
});

describe('accessibility', () => {
	it('has no axe violations for a page using every component', async () => {
		vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(900);
		vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
		const { container } = await renderMdx(
			[
				'### Section',
				'Text with [a link](https://example.com) and `inline`.',
				'#### Detail',
				'<Callout type="bug">Careful</Callout>',
				'<Decision>\n\nWe chose X.\n\n<Callout type="tradeoff">At a cost.</Callout>\n\n</Decision>',
				'<Figure file="shelby-dashboard.png" alt="A picture" width={10} height={10} caption="Caption" />',
				'```ts\nconst x = 1;\n```',
			].join('\n\n'),
		);

		expect(await axe(container)).toHaveNoViolations();
	});
});
