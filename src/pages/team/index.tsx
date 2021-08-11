import Layout from '../../components/Layout';
import BasicMeta from '../../components/meta/BasicMeta';
import OpenGraphMeta from '../../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../../components/meta/TwitterCardMeta';

import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export default function Team() {
  const url = '/team';
  const title = 'Team';

  const teamData = [
    {
      image: '/images/robert.jpg',
      name: 'Robert W. Steele',
      designation: 'CAE, SEC, S300W',
      desc1:
        'For the last 40 years Bob Steele has taught over 100 seminars on real estate exchanging and believes that “any problem can be resolved with a knowledgeable and counseled client.”  Bob co-founded the Real Estate News Observer (now Creative Real Estate) and Global Wealth.  He originated the Real Estate Expo and its convention that grew to 3,000 attendees.',
      desc2:
        'Bob has been awarded Counselor of the Year, Legend of the Society and Lifetime Membership of the national Society of Exchange Counselors and was inducted into the Real Estate Exchangers’ Hall of Fame. He has authored ten books, including the classic, 435-page 300 Ways to Buy, Sell or Exchange Real Estate.  Bob has co-found REXNET, a Real Estate Network exchange and custom cryptocurrency coin formation company.'
    },
    {
      image: '/images/gary.jpg',
      name: 'Gary M. Koeppel',
      designation: 'BS, BA, MFA',
      desc1:
        'Gary M. Koeppel is an entrepreneur who has led several careers during his eclectic professional life as an English professor, artisan, owner of six Coast Galleries, publisher and licensing agent;  founder of a Fire Department, Chamber of Commerce, newspaper, Enduring Freedom Foundation; author of two novels, art books and a television series screenplay.',
      desc2:
        'Koeppel founded Global Art Expos and produced 30 Art Expo events in Tokyo, Berlin, Tel Aviv, Paris and the US. He donated the Enduring Freedom Tribute sculpture to the Pentagon in Washington, DC, where it is the first exhibit seen at the main entrance. Koeppel co-founded REXNET, a cryptocurrency that creates custom coins and a crypto exchange for Real Estate transactions.'
    },
    {
      image: '/images/mike.jpg',
      name: 'Mike Bardi',
      designation: 'Crypto Consultant',
      desc1:
        'In June 2016, Mike Bardi started investing in cryptocurrencies as a hobby. After seeing some success, he discovered a new ecosystem forming that far exceeded cryptocurrencies, but realized the underlying technology called “Blockchain” was the backbone that made this all possible.',
      desc2:
        'Bardi specializes in everything related to “crypto” which includes investing in the space, creating custom digital assets on the blockchain, tokenomics and token security. Additionally, Bardi has extensive management experience working with development teams on both web & mobile projects.'
    }
  ];
  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />

      <div className="team">
        <Container fluid="md">
          <Row>
            <Col>
              <div className="heading mb-2">Our Trusted Team</div>
            </Col>
          </Row>
          {teamData.map((item, index) => {
            return (
              <Row key={index}>
                <Col className="mt-4">
                  <div className="name mt-2">{item.name}</div>
                  <div className="designation mt-2 mb-2">
                    {item.designation}
                  </div>
                  <div className="desc mb-2">{item.desc1}</div>
                  <div className="desc">{item.desc2}</div>
                </Col>
              </Row>
            );
          })}
        </Container>
      </div>
    </Layout>
  );
}
