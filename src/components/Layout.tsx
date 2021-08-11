import Head from 'next/head';
import Navigation from './Navigation';
import { Container } from 'react-bootstrap';
import Footer from './Footer';

type Props = {
  url: string;
  children: React.ReactNode;
  token?: string;
};
export default function Layout({ children, url, token }: Props) {
  const darkBg = url !== '/' ? 'dark-bg' : '';
  return (
    <>
      <Container fluid="md">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="apple-touch-icon" href="/icon.png" />
          <meta name="theme-color" content="#000" />
        </Head>
      </Container>
      <nav className={darkBg}>
        <Container fluid="md">
          <Navigation url={url} token={token} />
        </Container>
      </nav>
      <main>{children}</main>
      <footer>
        <Footer url={url} />
      </footer>
    </>
  );
}
