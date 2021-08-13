import Layout from './../../components/Layout';
import BasicMeta from './../../components/meta/BasicMeta';
import OpenGraphMeta from './../../components/meta/OpenGraphMeta';
import TwitterCardMeta from './../../components/meta/TwitterCardMeta';

import { useState } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import postFetcher from './../../lib/post-fetcher';
import SuccessModal from './../../components/Success-Modal';

type Props = {
  alertRef: any;
};

export default function Contact({ alertRef }: Props) {
  const url = '/contact';
  const title = 'Contact';

  const [validated, setValidated] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    const form = event.currentTarget;

    setValidated(true);
    if (form.checkValidity() === false) {
      return;
    }

    let fetchUrl = process.env.NEXT_PUBLIC_SERVER_URL + '/contactus';
    await postFetcher(
      fetchUrl,
      {
        name,
        email,
        message: message.trim()
      },
      {},
      alertRef
    ).then((res) => {
      setShowSuccessModal(true);
      setName('');
      setEmail('');
      setMessage('');
      setValidated(false);
    });
  };

  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />

      <div className="auth-section">
        <Container fluid="md">
          <div className="auth-container">
            <Row className="mb-4">
              <Col>
                <div className="heading">Contact Us</div>
              </Col>
            </Row>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group as={Row} controlId="contactUsName">
                <Form.Control
                  type="text"
                  placeholder="Name*"
                  onChange={(e: any) => setName(e.target.value)}
                  value={name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Row} controlId="contactUsEmail">
                <Form.Control
                  type="email"
                  placeholder="Email*"
                  onChange={(e: any) => setEmail(e.target.value)}
                  value={email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group controlId="inquiryMessage">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Message*"
                  className="textarea-formcontrol"
                  onChange={(e: any) => setMessage(e.target.value)}
                  value={message}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid message.
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="secondary" type="submit" block>
                Submit
              </Button>
            </Form>
          </div>
        </Container>

        <SuccessModal
          show={showSuccessModal}
          onHide={() => setShowSuccessModal(false)}
          message="Thank you! We have received your information. Soon our team will contact you."
        ></SuccessModal>
      </div>
    </Layout>
  );
}
