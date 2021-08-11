import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export default function Section4() {
  return (
    <>
      {/* Section 4 - Start */}
      <div className="home-section-4">
        <Container fluid="md">
          <Row>
            <Col sm={12} md={6}>
              <div className="image-1 d-none d-md-block">
                <Image
                  src="/images/section-4-1.jpg"
                  alt="Section 4 Image"
                  width={1218}
                  height={860}
                ></Image>
              </div>
              <div className="image-2 d-block d-md-none">
                <Image
                  src="/images/section-4-2.jpg"
                  alt="Section 4 Image"
                  width={688}
                  height={350}
                ></Image>
              </div>
            </Col>
            <Col
              xs={{ span: 12, order: 'first' }}
              sm={{ span: 12, order: 'first' }}
              md={{ span: 6, order: 'last' }}
            >
              <Row>
                <div className="heading mb-2">
                  What is the Rexnet Token Market?
                </div>
                <div className="desc">
                  Rexnet Tokens may be purchased online using any payment system
                  and are used with the simplified Rexnet Easy-Pay Wallet™.
                </div>
              </Row>
              <Row>
                <div className="heading mb-2">
                  What is a Rexnet Market Maker?
                </div>
                <div className="desc">
                  Become a Market Maker. Earn commissions by selling new Rexnet
                  Postings, Custom Tokens and Rexnet Tokens.
                </div>
              </Row>
              <Row>
                <div className="heading mb-2">
                  What is Proof-of-Use™ Pricing?
                </div>
                <div className="desc">
                  Rexnet Token prices are determined by the revolutionary
                  “Proof-of-Use™ methodology that increases the price when
                  tokens are used in real estate and asset transactions.
                </div>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      {/* Section 4 - End */}
    </>
  );
}
