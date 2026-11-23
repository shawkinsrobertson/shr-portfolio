import { getProjectImageUrl } from '../../lib/projects';

interface FigureProps {
	/** File name inside src/content/projects/case-study-img/. */
	file: string;
	/** Required: describes the image for people who cannot see it. */
	alt: string;
	width: number;
	height: number;
	caption?: string;
	/** 'browser' wraps the image in a simple window frame (for desktop screenshots). */
	frame?: 'browser';
}

export function Figure({ file, alt, width, height, caption, frame }: FigureProps) {
	// Alt text is not optional: an image without it is dropped (and reported) instead of published unlabeled.
	if (typeof alt !== 'string' || alt.trim() === '') {
		console.error(`Figure "${file}" needs alt text, so it was not rendered.`);
		return null;
	}
	const src = getProjectImageUrl(file);
	if (!src) {
		console.error(`Figure image "${file}" was not found in src/content/projects/case-study-img/.`);
		return null;
	}

	const img = <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" />;

	return (
		<figure className={frame === 'browser' ? 'figure figure-browser' : 'figure'}>
			{frame === 'browser' ? (
				// The bar is decoration only, hidden from assistive tech; the image keeps its own alt text.
				<div className="browser-frame">
					<div className="browser-bar" aria-hidden="true">
						<span />
						<span />
						<span />
					</div>
					{img}
				</div>
			) : (
				img
			)}
			{caption && <figcaption>{caption}</figcaption>}
		</figure>
	);
}
