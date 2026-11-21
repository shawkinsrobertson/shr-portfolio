import { useLayoutEffect, useRef, useState, type ComponentProps } from 'react';

// A code block that scrolls sideways must be reachable by keyboard (WCAG 2.1.1), so it only becomes a
// focusable, labelled region when it actually overflows. Blocks that fit are not extra tab stops.
export function CodeBlock(props: ComponentProps<'pre'>) {
	const ref = useRef<HTMLPreElement>(null);
	const [scrolls, setScrolls] = useState(false);

	useLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;
		const measure = () => setScrolls(element.scrollWidth > element.clientWidth);
		measure();
		const observer = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
		observer?.observe(element);
		return () => observer?.disconnect();
	}, []);

	const focusable = scrolls ? { tabIndex: 0, role: 'region', 'aria-label': 'Code sample, scrollable' } : {};

	return <pre {...props} ref={ref} className="code-block" {...focusable} />;
}
