import type { AppProps } from "next/app";
import "../styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {

  if (typeof document !== 'undefined') {
    // document を使用したコード
    return (<></>);
  }

  return (
      <Component {...pageProps} />
  );
}
