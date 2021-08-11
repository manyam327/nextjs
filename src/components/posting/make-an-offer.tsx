import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import postFetcher from '../../lib/post-fetcher';
import { getDateInMMYYYYFormat, offerTypes } from '../../lib/helper';
import Image from 'next/image';

type Props = {
  show: boolean;
  onHide: any;
  setToken: any;
  product?: any;
  alertRef?: any;
};
export default function MakeAnOfferModal({
  show,
  onHide,
  setToken,
  alertRef,
  product
}: Props) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [validated, setValidated] = useState(false);

  const [offerType, setOfferType] = useState<any>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [info, setInfo] = useState('');
  const [offerFormValidated, setOfferFormValidated] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (token) {
      setLoggedIn(true);
    }
  });

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

  const handleOfferFormSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;

    setOfferFormValidated(true);
    if (form.checkValidity() === false) {
      return;
    } else {
      const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/product/makeanoffer`;
      const postData = {
        name,
        email,
        phone,
        info,
        offerType,
        number: product.id,
        listingUrl: window.location.href,
        createdBy: product.createdBy
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
        onHide('Thank you! Your offer has been submitted.');
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
        <Modal.Title id="contained-modal-title-vcenter" className="d-flex">
          {loggedIn && (
            <Image src="/logo.png" alt="Logo" width={42} height={42} />
          )}

          <span className="d-inline-flex align-items-center ml-2">
            {loggedIn
              ? 'Rexnet Offer Form'
              : 'To make an offer you must first log in.'}
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          {loggedIn ? (
            <Form
              noValidate
              validated={offerFormValidated}
              onSubmit={handleOfferFormSubmit}
            >
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <div className="mb-4">
                    <div className="label">Property</div>
                    <div
                      className="value offer-value-name mt-2"
                      onClick={() =>
                        window.open(window.location.href, '_blank')
                      }
                    >
                      {product?.name}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="label">ID #</div>
                    <div className="value mt-2">
                      {product?.id}-{getDateInMMYYYYFormat(product?.listedDate)}
                      {product?.commission && ` (${product?.commission})`}
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="label">Select offer type:*</div>
                    <div className="value mt-2">
                      <Form.Group controlId="offerTypes">
                        <Row>
                          <Col xs={6}>
                            {offerTypes.slice(0, 3).map((item, index) => {
                              return (
                                <Form.Check
                                  label={item}
                                  name={item}
                                  type="checkbox"
                                  id={`offer-type-${index}`}
                                  value={item}
                                  key={index}
                                  onChange={(e: any) =>
                                    setOfferType({
                                      ...offerType,
                                      [e.target.name]: e.target.checked
                                    })
                                  }
                                  checked={offerType[item]}
                                />
                              );
                            })}
                          </Col>
                          <Col xs={6}>
                            {offerTypes.slice(3, 6).map((item, index) => {
                              return (
                                <Form.Check
                                  label={item}
                                  name={item}
                                  type="checkbox"
                                  id={`offer-type-${index + 3}`}
                                  value={item}
                                  key={index}
                                  onChange={(e: any) =>
                                    setOfferType({
                                      ...offerType,
                                      [e.target.name]: e.target.checked
                                    })
                                  }
                                  checked={offerType[item]}
                                />
                              );
                            })}
                          </Col>
                        </Row>
                      </Form.Group>
                    </div>
                  </div>
                </Col>
                <Col xs={12} sm={12} md={6}>
                  <div className="form-heading mb-2">
                    Fill out the form below and the representative or owner will
                    be in touch.
                  </div>
                  <Form.Group controlId="makeAnOfferName">
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
                  <Form.Group controlId="makeAnOfferEmail">
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
                  <Form.Group controlId="makeAnOfferPhone">
                    <Form.Control
                      type="number"
                      placeholder="Phone*"
                      onChange={(e: any) => setPhone(e.target.value)}
                      value={phone}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid phone.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="makeAnOfferInfo">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Write Offer Here*"
                      className="textarea-formcontrol"
                      onChange={(e: any) => setInfo(e.target.value)}
                      value={info}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid information.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div className="info mb-2">
                    *This is a non-binding preliminary proposal presented to
                    parties in hopes that a binding agreement might be reached.
                  </div>
                  <Button variant="secondary" type="submit" block>
                    Submit Offer
                  </Button>
                </Col>
              </Row>
            </Form>
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
