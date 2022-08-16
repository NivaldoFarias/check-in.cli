import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';

import type { AppProps } from 'next/app';
import '../styles/index.scss';

import { DataProvider } from '../contexts/DataContext';

function MyApp(props: AppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  return (
    <DataProvider>
      <SessionProvider session={session}>
        <Head>
          <title>Check-in client</title>
        </Head>
        <Component {...pageProps} />
      </SessionProvider>
    </DataProvider>
  );
}

export default MyApp;
