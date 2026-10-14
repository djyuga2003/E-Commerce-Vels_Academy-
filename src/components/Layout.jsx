import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router';
import { STORE_NAME, STORE_TAGLINE } from '../config';
import Header from './Header';
import './Layout.css';

const YEAR = new Date().getFullYear();

export default function Layout() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const mainRef = useRef(null);

  // Behave like a full page load on in-app navigation: start at the top and move focus into the new page.
  // Back/forward (POP) is left to the browser.
  useEffect(() => {
    if (navigationType === 'POP') return;
    window.scrollTo(0, 0);
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname, navigationType]);

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" ref={mainRef} className="container main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container site-footer__inner">
          <span>
            © {YEAR} {STORE_NAME}
          </span>
          <span>{STORE_TAGLINE}</span>
        </div>
      </footer>
    </div>
  );
}
