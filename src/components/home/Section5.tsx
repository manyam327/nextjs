import { Container, Row, Col } from 'react-bootstrap';
import CategorySwiper from '../Category-Swiper';

type Props = {
  deviceType: string;
};

export default function Section5({ deviceType }: Props) {
  return (
    <>
      {/* Section 5 - Start */}
      <div className="home-section-5">
        <Container fluid="md" className="mb-4">
          <Row>
            <Col xs={12}>
              <div className="heading mb-4">
                Rexnet Posting Service Categories
              </div>
              {/* <div className="desc">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem .
              </div> */}
            </Col>
          </Row>
        </Container>
        <CategorySwiper deviceType={deviceType} />
      </div>
      {/* Section 5 - End */}
    </>
  );
}
