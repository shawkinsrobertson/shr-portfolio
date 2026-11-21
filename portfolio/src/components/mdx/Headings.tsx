import type { ComponentProps } from 'react';

// The page title is the only h1 and project sections are h2, so a `###` in an .mdx file renders as an h2
// (and `####` as h3, ...). Authors write ### and cannot produce a skipped heading level.
export const H2 = (props: ComponentProps<'h2'>) => <h2 {...props} />;
export const H3 = (props: ComponentProps<'h3'>) => <h3 {...props} />;
export const H4 = (props: ComponentProps<'h4'>) => <h4 {...props} />;
export const H5 = (props: ComponentProps<'h5'>) => <h5 {...props} />;
