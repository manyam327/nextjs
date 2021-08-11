// add bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';

import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { useRef } from 'react';
import Alert from './../components/Alert';

function MyApp({ Component, pageProps }: AppProps) {
  const alertRef = useRef({});
  return (
    <>
      <Component {...pageProps} alertRef={alertRef} />
      <Alert alertRef={alertRef} />
    </>
  );
}
export default MyApp;
