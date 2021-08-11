import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';

export default function Section3() {
  return (
    <>
      {/* Section 3 - Start */}
      <div className="home-section-3">
        <Container fluid="md">
          <Row>
            <Col xs={12} sm={6}>
              <Row>
                <div className="heading mb-2">
                  Why Use Crypto with Real Estate?
                </div>
                <div className="desc">
                  Tokenizing real estate and other assets creates new
                  transaction opportunities that may increase the utility and
                  value of an investment.
                </div>
              </Row>
              <Row>
                <div className="heading mb-2">
                  What is the Rexnet Posting Service?
                </div>
                <div className="desc">
                  The RPS is a pro-active inventory of real estate and asset
                  Postings that may use cryptocurrencies for all or part of a
                  transaction.
                </div>
              </Row>
              <Row>
                <div className="heading mb-2">
                  What is the Rexnet Token Maker?
                </div>
                <div className="desc">
                  Rexnet creates customized cryptocurrency tokens designed to
                  fulfill individual and corporate goals. Buy and exchange
                  Rexnet Tokens online.
                </div>
              </Row>
            </Col>
            <Col xs={12} sm={6}>
              <div className="image-1">
                <Image
                  src="/images/section-3-1.jpg"
                  alt="Section 3 Image - 1"
                  width={576}
                  height={525}
                ></Image>
              </div>
              <div className="image-2">
                <Image
                  src="/images/section-3-2.jpg"
                  alt="Section 3 Image - 2"
                  width={493}
                  height={323}
                ></Image>
              </div>
            </Col>
          </Row>
        </Container>
        <br />
        <br />
        <br />
      </div>
      {/* Section 3 - End */}
    </>
  );
}
