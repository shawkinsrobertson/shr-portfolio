import type { ComponentProps } from 'react';
import { Link } from 'react-router';

// Case studies are written by the site owner, but a link scheme is still checked: anything that is not
// https, mailto, a same-site path, or an in-page anchor renders as plain text (no javascript: or data: links).
const isExternal = (href: string) => /^https:\/\//i.test(href);
const isMail = (href: string) => /^mailto:/i.test(href);
const isInternal = (href: string) => /^\/(?!\/)/.test(href);
const isAnchor = (href: string) => href.startsWith('#');

export function SafeLink({ href = '', children, ...rest }: ComponentProps<'a'>) {
	if (isExternal(href)) {
		return (
			<a {...rest} href={href} target="_blank" rel="noopener noreferrer">
				{children} <span className="visually-hidden">(opens in new tab)</span>
			</a>
		);
	}
	if (isInternal(href)) return <Link to={href}>{children}</Link>;
	if (isMail(href) || isAnchor(href)) return <a {...rest} href={href}>{children}</a>;
	return <span>{children}</span>;
}
