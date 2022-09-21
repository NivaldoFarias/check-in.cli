import { SessionProvider } from "next-auth/react";
import Head from "next/head";

import type { AppProps } from "next/app";
import "../styles/index.scss";

import { CheckInContextProvider } from "../contexts/CheckInContext";
import { AddressDataProvider } from "../contexts/AddressContext";
import { DataProvider } from "../contexts/DataContext";

function MyApp(props: AppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps },
  } = props;

  return (
    <DataProvider>
      <CheckInContextProvider>
        <AddressDataProvider>
          <SessionProvider session={session}>
            <Head>
              <title>Check-in client</title>
            </Head>
            <Component {...pageProps} />
          </SessionProvider>
        </AddressDataProvider>
      </CheckInContextProvider>
    </DataProvider>
  );
}

export default MyApp;
