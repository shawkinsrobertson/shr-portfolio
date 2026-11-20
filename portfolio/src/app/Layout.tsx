import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from '../components/Footer/Footer';
import { Nav } from '../components/Nav/Nav';
import { SkipLink } from '../components/SkipLink/SkipLink';

export function Layout() {
	const { pathname } = useLocation();
	const mainRef = useRef<HTMLElement>(null);
	const previousPath = useRef(pathname);

	// A client-side route change does not move focus or tell a screen reader anything happened,
	// so send focus to <main> (not on first load) and start the new page at the top.
	useEffect(() => {
		if (previousPath.current === pathname) return;
		previousPath.current = pathname;
		window.scrollTo(0, 0);
		mainRef.current?.focus({ preventScroll: true });
	}, [pathname]);

	return (
		<>
			<SkipLink />
			<Nav />
			<main id="main" ref={mainRef} tabIndex={-1}>
				<Outlet />
			</main>
			<Footer />
		</>
	);
}
