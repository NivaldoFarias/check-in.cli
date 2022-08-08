import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

import '../styles/globals.scss';

function MyApp(props: AppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
