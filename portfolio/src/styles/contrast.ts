// Test helpers: read design tokens out of the theme CSS and compute WCAG contrast.
export type Rgba = { r: number; g: number; b: number; a: number };

export function parseTokens(css: string): Record<string, string> {
	const tokens: Record<string, string> = {};
	for (const [, , body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
		for (const [, name, value] of body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
			tokens[name] = value.trim();
		}
	}
	return tokens;
}

export function resolve(tokens: Record<string, string>, name: string): string {
	let value = tokens[name];
	if (value === undefined) throw new Error(`Missing token ${name}`);
	for (let depth = 0; depth < 10; depth++) {
		const ref = value.match(/^var\((--[\w-]+)\)$/);
		if (!ref) return value;
		const next = tokens[ref[1]];
		if (next === undefined) throw new Error(`Missing token ${ref[1]} (from ${name})`);
		value = next;
	}
	throw new Error(`Token ${name} has a reference cycle`);
}

export function toRgba(color: string): Rgba {
	const hex = color.match(/^#([0-9a-f]{6})$/i);
	if (hex) {
		const n = parseInt(hex[1], 16);
		return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
	}
	const rgba = color.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)$/i);
	if (rgba) return { r: +rgba[1], g: +rgba[2], b: +rgba[3], a: rgba[4] === undefined ? 1 : +rgba[4] };
	throw new Error(`Unsupported color "${color}" (use #rrggbb or rgb/rgba)`);
}

export function over(top: Rgba, bottom: Rgba): Rgba {
	const a = top.a + bottom.a * (1 - top.a);
	const mix = (t: number, b: number) => (t * top.a + b * bottom.a * (1 - top.a)) / a;
	return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a };
}

function luminance({ r, g, b }: Rgba) {
	const lin = (c: number) => {
		const s = c / 255;
		return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function contrast(fg: Rgba, bg: Rgba): number {
	const [hi, lo] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}
