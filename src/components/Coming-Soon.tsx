import { Container, Row, Col, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';

export default function ComingSoon() {
  const router = useRouter();

  return (
    <div className="coming-soon">
      <Container fluid="md">
        <div className="coming-soon-container mt-4">
          <Row className="name mb-3">
            <Col>
              <div className="heading">Rexnet</div>
              <div>The Real Estate Disrupter</div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <div className="main-heading mb-3">Coming Soon!</div>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col>
              <div className="desc">
                This page is coming soon. Stay tuned. For more information
                <br /> or to ask questions, please{' '}
                <span className="link">contact us.</span>
              </div>
            </Col>
          </Row>

          <Button variant="secondary" onClick={() => router.push('/contact')}>
            Contact Us
          </Button>
        </div>
      </Container>
    </div>
  );
}
