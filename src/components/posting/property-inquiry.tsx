import { useState, useEffect } from 'react';
import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { getDateInMMYYYYFormat } from '../../lib/helper';
import postFetcher from '../../lib/post-fetcher';

type Props = {
  show: boolean;
  onHide: any;
  setToken: any;
  product?: any;
  alertRef: any;
};
export default function PropertyInquiryModal({
  show,
  onHide,
  setToken,
  alertRef,
  product
}: Props) {
  if (!product) return <>'Loading...'</>;

  const [loggedIn, setLoggedIn] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [validated, setValidated] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryFormValidated, setInquiryFormValidated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      setLoggedIn(true);
    }
  });

  useEffect(() => {
    setName('');
    setEmail('');
    setMessage('');
    const token = sessionStorage.getItem('token');

    if (token) {
      setLoggedIn(true);
    }
    setFormSuccess(false);
  }, [show]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;

    setValidated(true);
    if (form.checkValidity() === false) {
      return;
    } else {
      const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`;
      const response: any = await postFetcher(
        fetchUrl,
        {
          username: emailInput,
          password: passwordInput
        },
        {},
        alertRef
      );

      if (response) {
        sessionStorage.setItem('token', response.token);
        sessionStorage.setItem('_id', response._id);
        sessionStorage.setItem('username', emailInput);
        setToken(response.token);
      }
    }
  };

  const handleInquiryFormSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;

    setInquiryFormValidated(true);
    if (form.checkValidity() === false) {
      return;
    } else {
      const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/product/contactowner`;
      const createdBy = sessionStorage.getItem('_id');
      const postData = {
        name,
        email,
        message,
        createdBy,
        createdFor: product.createdBy
      };
      const token = sessionStorage.getItem('token');
      await postFetcher(
        fetchUrl,
        postData,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        },
        alertRef
      ).then((res) => {
        onHide('Thank you! Your contact message has been submitted.');
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size={loggedIn ? 'lg' : undefined}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {loggedIn
            ? 'Property Inquiry'
            : 'To Contact Owner or Agent, you must first log in.'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {loggedIn ? (
            <Row>
              <Col xs={12} sm={12} md={6}>
                <div className="mb-4">
                  <div className="label">Property</div>
                  <div className="value mt-2">{product?.name}</div>
                </div>
                <div className="mb-4">
                  <div className="label">ID #</div>
                  <div className="value mt-2">
                    {product?.id}-{getDateInMMYYYYFormat(product?.listedDate)}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="label">Category</div>
                  <div className="value mt-2">
                    {product?.haveCategory?.map((item: string) => {
                      return (
                        <span className={'logo ml-2 ' + item} key={item}>
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="label">Wants</div>
                  <div className="value mt-2">
                    {product?.wantCategory?.map((item: string) => {
                      return (
                        <span className={'logo ml-2 ' + item} key={item}>
                          {item}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={12} md={6}>
                <div className="form-heading mb-2">
                  Fill out the form below and the seller will be in touch.
                </div>
                <Form
                  noValidate
                  validated={inquiryFormValidated}
                  onSubmit={handleInquiryFormSubmit}
                >
                  <Form.Group controlId="inquiryName">
                    <Form.Control
                      type="text"
                      placeholder="Your Name*"
                      onChange={(e: any) => setName(e.target.value)}
                      value={name}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid name.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="inquiryEmail">
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
                    Contact Owner or Agent
                  </Button>
                </Form>
              </Col>
            </Row>
          ) : (
            <div className="auth-container">
              <Row className="mb-4">
                <Col>
                  <div className="heading">Rexnet Log In</div>
                </Col>
              </Row>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group as={Row} controlId="loginEmail">
                  <Form.Control
                    type="email"
                    placeholder="Email"
                    onChange={(e: any) => setEmailInput(e.target.value)}
                    value={emailInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} controlId="loginPassword">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    onChange={(e: any) => setPasswordInput(e.target.value)}
                    value={passwordInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Row} controlId="loginCheckbox">
                  <Form.Check type="checkbox" label="Remember Me" />
                </Form.Group>
                <Button variant="secondary" type="submit" block>
                  Sign In
                </Button>
              </Form>
              <Row>
                <Col className="link-content mt-4">
                  Don’t have an account?&ensp;
                  <a href="/signup" className="link">
                    Sign up!
                  </a>
                </Col>
              </Row>
              <Row>
                <Col className="link-content mt-4">
                  <a href="/forgot-pass" className="link">
                    Forgot password?
                  </a>
                </Col>
              </Row>
            </div>
          )}
        </Container>
      </Modal.Body>
    </Modal>
  );
}
