import type { ReactNode } from 'react';

// One decision from a "What I Did" section, with its trade-off callout if it has one. It is only a group
// (no landmark, no heading) so the page outline is unchanged; its job is to keep each decision visually
// together and spaced apart from the next.
export function Decision({ children }: { children: ReactNode }) {
	return <div className="decision">{children}</div>;
}
