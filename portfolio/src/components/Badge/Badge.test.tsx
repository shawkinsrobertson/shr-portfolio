import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from '../../test/axe';
import { Badge } from './Badge';

describe('Badge', () => {
	it.each([
		['hand-coded', 'Hand-coded'],
		['agentic', 'Agentic'],
	] as const)('says %s in text, not just color or an icon', (kind, label) => {
		render(<Badge kind={kind} />);

		expect(screen.getByText(label)).toBeInTheDocument();
	});

	it('hides its decorative icon from screen readers', () => {
		const { container } = render(<Badge kind="agentic" />);

		expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
	});

	it('looks different per kind via a modifier class (shape, not only color)', () => {
		const { rerender, container } = render(<Badge kind="hand-coded" />);
		const hand = container.firstElementChild?.className;
		rerender(<Badge kind="agentic" />);

		expect(container.firstElementChild?.className).not.toBe(hand);
	});

	it('has no accessibility violations', async () => {
		const { container } = render(<Badge kind="agentic" />);

		expect(await axe(container)).toHaveNoViolations();
	});
});
