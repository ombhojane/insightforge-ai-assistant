// pages/_app.tsx
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Router from 'next/router';
import '../styles/globals.css';  // Ensure your global CSS file is correctly referenced

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const handleRouteChangeStart = () => {
      document.getElementById('__next')?.classList.add('fade-out');
    };

    const handleRouteChangeComplete = () => {
      document.getElementById('__next')?.classList.remove('fade-out');
    };

    Router.events.on('routeChangeStart', handleRouteChangeStart);
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    Router.events.on('routeChangeError', handleRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
      Router.events.off('routeChangeError', handleRouteChangeComplete);
    };
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
