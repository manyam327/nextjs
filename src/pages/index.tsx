import Layout from './../components/Layout';
import BasicMeta from './../components/meta/BasicMeta';
import OpenGraphMeta from './../components/meta/OpenGraphMeta';
import TwitterCardMeta from './../components/meta/TwitterCardMeta';
import UAParser from 'ua-parser-js';

import Section1 from './../components/home/Section1';
import Section2 from './../components/home/Section2';
import Section3 from './../components/home/Section3';
import Section4 from './../components/home/Section4';
import Section5 from './../components/home/Section5';
import Section6 from './../components/home/Section6';

import fetcher from './../lib/get-fetcher';
import useSWR from 'swr';
import { useEffect, useState } from 'react';

type Props = {
  deviceType: string;
};

const Home = ({ deviceType }: Props) => {
  const url = '/';
  const title = 'The Real Estate Disrupter';

  const productServerUrl: any = process.env.NEXT_PUBLIC_SERVER_URL + '/product';
  const { error, data } = useSWR(productServerUrl, fetcher);
  const [startedFlag, setStartedFlag] = useState(false);

  useEffect(() => {
    const onScroll = (e: any) => {
      // console.log(e.target.documentElement.scrollTop);
      if (e.target.documentElement.scrollTop > 2000 && !startedFlag) {
        setStartedFlag(true);
      }
    };
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  });

  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />

      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 deviceType={deviceType} />
      {startedFlag && <Section6 count={data ? data.totalDocs : 0} />}
    </Layout>
  );
};

Home.getInitialProps = ({ req }: any) => {
  let userAgent;
  if (req) {
    userAgent = req.headers['user-agent'];
  } else {
    userAgent = navigator.userAgent;
  }
  const parser = new UAParser();
  parser.setUA(userAgent);
  const result = parser.getResult();
  const deviceType = (result.device && result.device.type) || 'desktop';
  return { deviceType };
};
export default Home;
