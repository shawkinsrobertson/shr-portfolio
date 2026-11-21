import './mdx.css';
import type { MDXComponents } from 'mdx/types';
import { Callout } from './Callout';
import { CodeBlock } from './CodeBlock';
import { Decision } from './Decision';
import { Figure } from './Figure';
import { H2, H3, H4, H5 } from './Headings';
import { SafeLink } from './SafeLink';

export const mdxComponents: MDXComponents = {
	h3: H2,
	h4: H3,
	h5: H4,
	h6: H5,
	a: SafeLink,
	pre: CodeBlock,
	Figure,
	Callout,
	Decision,
};
