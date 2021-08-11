import Layout from './../../components/Layout';
import BasicMeta from './../../components/meta/BasicMeta';
import OpenGraphMeta from './../../components/meta/OpenGraphMeta';
import TwitterCardMeta from './../../components/meta/TwitterCardMeta';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import postFetcher from './../../lib/post-fetcher';

type Props = {
  alertRef: any;
};
export default function Login({ alertRef }: Props) {
  const url = '/login';
  const title = 'Log In';

  const router = useRouter();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const message = sessionStorage.getItem('message');
    if (message) {
      alertRef?.current?.showAlert('danger', message);
      sessionStorage.removeItem('message');
    }
  }, []);

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
        return router.push('/postings');
      }
    }
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
        </Container>
      </div>
    </Layout>
  );
}
