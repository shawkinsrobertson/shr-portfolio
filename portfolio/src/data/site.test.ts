import { describe, expect, it } from 'vitest';
import { httpsUrl, site } from './site';

describe('httpsUrl', () => {
	it('passes https URLs through', () => {
		expect(httpsUrl('https://example.substack.com')).toBe('https://example.substack.com');
	});

	it.each([undefined, '', 'coming soon', 'http://example.com', 'javascript:alert(1)', 'https://', 'https://a b'])(
		'returns nothing for %j',
		(value) => {
			expect(httpsUrl(value)).toBeUndefined();
		},
	);
});

describe('site data', () => {
	it('has an email and https profile links', () => {
		expect(site.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
		expect(httpsUrl(site.linkedin)).toBe(site.linkedin);
		expect(httpsUrl(site.github)).toBe(site.github);
	});

	it('only exposes Substack once it is a real https URL', () => {
		expect(site.substack === undefined || httpsUrl(site.substack) === site.substack).toBe(true);
	});

	it('points the resume at a PDF served from /resume/', () => {
		expect(site.resume.href).toMatch(/^\/resume\/[\w-]+\.pdf$/);
	});

	it('describes the headshot for people who cannot see it', () => {
		expect(site.headshot.alt.trim()).not.toBe('');
		expect(site.headshot.width).toBeGreaterThan(0);
		expect(site.headshot.height).toBeGreaterThan(0);
	});
});
