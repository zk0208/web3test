import { SWRConfig, SWRConfiguration } from "swr";
import type { AppProps } from "next/app";
import "~/styles/global.css";
import React from "react";

export default function App({ Component, pageProps }: AppProps) {
  const options: SWRConfiguration = {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  };
  return (
    <SWRConfig value={options}>
    <Component {...pageProps} />
    </SWRConfig>
    
  );
}
