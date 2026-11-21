import type { ReactNode } from 'react';

const LABELS = {
	note: 'Note',
	bug: 'Known bug',
	learning: 'Lesson learned',
} as const;

interface CalloutProps {
	type?: keyof typeof LABELS;
	children: ReactNode;
}

// The label is text, so the variant is never conveyed by color alone.
export function Callout({ type = 'note', children }: CalloutProps) {
	const variant = type in LABELS ? type : 'note';

	return (
		<div role="note" className={`callout callout-${variant}`}>
			<p className="callout-label">{LABELS[variant]}</p>
			<div>{children}</div>
		</div>
	);
}
