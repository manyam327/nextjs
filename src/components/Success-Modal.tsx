import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import SuccessIcon from './../assets/svg/Success.svg';

type Props = {
  show: boolean;
  onHide: any;
  message: string;
};
export default function SuccessModal({ show, onHide, message }: Props) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton className="no-border">
        <Container className="pt-3 text-center">
          <Row>
            <Col>
              <SuccessIcon width={50} height={50} />
            </Col>
          </Row>
        </Container>
      </Modal.Header>
      <Modal.Body className="py-3 no-border">
        <Container className="text-center">
          <Row className="mb-4">
            <Col>
              <div className="success-info">{message}</div>
            </Col>
          </Row>
          <Button
            variant="secondary"
            type="button"
            className="cancel-btn"
            onClick={onHide}
          >
            Close
          </Button>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
