import './SkipLink.css';

export function SkipLink() {
	const skip = (event: React.MouseEvent<HTMLAnchorElement>) => {
		event.preventDefault();
		const main = document.getElementById('main');
		main?.focus();
		main?.scrollIntoView?.();
	};

	return (
		<a className="skip-link" href="#main" onClick={skip}>
			Skip to main content
		</a>
	);
}
