import type { ReactNode } from 'react';

// One decision from a "What I Did" section: a #### title (rendered h3), its text, and a trade-off callout if it
// has one. The wrapper is only a group (no landmark), so it adds nothing to the page outline; its job is to
// keep each decision visually together and spaced apart from the next.
export function Decision({ children }: { children: ReactNode }) {
	return <div className="decision">{children}</div>;
}
