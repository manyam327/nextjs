import { Container, Row, Col } from 'react-bootstrap';

export default function Section2() {
  return (
    <>
      {/* Section 2 - Start */}
      <div className="home-section-2">
        <Container fluid="md">
          <div className="heading pt-4">
            The $228 Trillion Global Real Estate market is the largest asset
            class in the world.
          </div>
          <Row className="py-4">
            <Col xs={12} sm={3}>
              <Row>
                {/* <Col className="number" xs={4}>
                  01
                </Col> */}
                <Col className="desc">
                  Post Assets
                  <br />
                  Have / Want
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={3}>
              <Row>
                {/* <Col className="number" xs={4}>
                  02
                </Col> */}
                <Col className="desc">
                  Create Custom
                  <br />
                  Crypto Tokens
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={3}>
              <Row>
                {/* <Col className="number" xs={4}>
                  03
                </Col> */}
                <Col className="desc">
                  Buy Rexnet
                  <br />
                  Crypto Tokens
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={3}>
              <Row>
                {/* <Col className="number" xs={4}>
                  04
                </Col> */}
                <Col className="desc no-border">
                  Earn Commissions
                  <br />
                  Open to Everyone
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
      {/* Section 2 - End */}
    </>
  );
}
