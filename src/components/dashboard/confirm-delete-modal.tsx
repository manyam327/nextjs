import { Modal, Button, Container, Row, Col } from 'react-bootstrap';

type Props = {
  show: boolean;
  onHide: any;
  onDelete: any;
  from: string;
};
export default function ConfirmDeleteModal({
  show,
  onHide,
  onDelete,
  from
}: Props) {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body className="confirm-delete-modal text-center">
        <Container>
          <Row>
            <Col xs={12}>
              <div className="delete-heading">Delete {from}</div>
              <div className="delete-desc">
                Are you sure you want to permanently delete this{' '}
                {from.toLowerCase()}?
              </div>
              <div className="buttons mt-3">
                <Button
                  variant="secondary"
                  type="submit"
                  onClick={() => onHide()}
                  className="cancel-btn mr-3"
                >
                  Cancel
                </Button>
                <Button
                  variant="secondary"
                  type="submit"
                  onClick={() => onDelete()}
                >
                  Delete
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
}
