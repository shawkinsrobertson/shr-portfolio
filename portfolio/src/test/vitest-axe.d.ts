import 'vitest';
import type { AxeMatchers } from 'vitest-axe/matchers';

declare module 'vitest' {
	// oxlint-disable-next-line no-explicit-any
	interface Assertion<T = any> extends AxeMatchers {}
	interface AsymmetricMatchersContaining extends AxeMatchers {}
}
