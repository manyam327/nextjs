import Layout from './../../components/Layout';
import BasicMeta from './../../components/meta/BasicMeta';
import OpenGraphMeta from './../../components/meta/OpenGraphMeta';
import TwitterCardMeta from './../../components/meta/TwitterCardMeta';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import postFetcher from './../../lib/post-fetcher';
import { useRouter } from 'next/router';
import { CodeSentType } from './../../lib/constant';

type Props = {
  alertRef: any;
};

export default function Signup({ alertRef }: Props) {
  const url = '/signup';
  const title = 'Sign Up';
  const router = useRouter();
  const [showConfirmSignup, setShowConfirmSignup] = useState(false);
  const [enableResend, setEnableResend] = useState(false);
  const [hash, setHash] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [isPasswordSame, setIsPasswordSame] = useState(true);
  const [validated, setValidated] = useState(false);

  const [code, setCode] = useState('');
  const [codeFormValidated, setCodeFormValidated] = useState(false);

  const handleSubmit = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    const form = event.currentTarget;
    setIsPasswordSame(true);

    setValidated(true);
    if (form.checkValidity() === false) {
      return;
    }

    if (password !== confirmPassword) {
      setIsPasswordSame(false);
      return;
    }

    let fetchUrl = process.env.NEXT_PUBLIC_SERVER_URL + '/auth/register';
    await postFetcher(
      fetchUrl,
      {
        name,
        email,
        password
      },
      {},
      alertRef
    ).then((res) => {
      if (res && res.hash) {
        setHash(res.hash);
        setShowConfirmSignup(true);
        setTimeout(() => {
          setEnableResend(true);
        }, 120000);
      }
    });
  };

  const confirmEmail = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    const form = event.currentTarget;

    setCodeFormValidated(true);
    if (form.checkValidity() === false) {
      return;
    }

    let fetchUrl = process.env.NEXT_PUBLIC_SERVER_URL + '/auth/verify';
    await postFetcher(
      fetchUrl,
      {
        username: email,
        hash: hash,
        otp: code
      },
      {},
      alertRef
    ).then((res) => {
      if (res && res.access_token && res._id) {
        sessionStorage.setItem('token', res.access_token);
        sessionStorage.setItem('_id', res._id);
        sessionStorage.setItem('username', email);
        return router.push('/dashboard');
      }
    });
  };

  const reSendconfirmationEmail = async () => {
    // Resend Code
    setEnableResend(false);
    let fetchUrl = process.env.NEXT_PUBLIC_SERVER_URL + '/auth/code-sent';
    await postFetcher(
      fetchUrl,
      {
        username: email,
        type: CodeSentType.Verify
      },
      {},
      alertRef
    ).then((res) => {
      if (res && res.hash) {
        setHash(res.hash);
        setTimeout(() => {
          setEnableResend(true);
        }, 120000);
      }
    });
  };

  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />

      <div className="auth-section">
        <Container fluid="md">
          <div className={showConfirmSignup ? 'd-none' : 'auth-container'}>
            <Row className="mb-4">
              <Col>
                <div className="heading">Rexnet Sign Up</div>
              </Col>
            </Row>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <Form.Group as={Row} controlId="signupName">
                <Form.Control
                  type="text"
                  placeholder="Name"
                  onChange={(e: any) => setName(e.target.value)}
                  value={name}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid name.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Row} controlId="signupEmail">
                <Form.Control
                  type="email"
                  placeholder="Email"
                  onChange={(e: any) => setEmail(e.target.value)}
                  value={email}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Row} controlId="signupPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e: any) => setPassword(e.target.value)}
                  value={password}
                  required
                  pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{6,32}$"
                />
                <Form.Control.Feedback type="invalid">
                  Valid password should contain atleast 1 lowercase letter, 1
                  uppercase letter, 1 digit and should contain minium 6
                  characters.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Row} controlId="signupConfirmPassword">
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e: any) => setConfirmPassword(e.target.value)}
                  isInvalid={confirmPassword !== password}
                  value={confirmPassword}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  {isPasswordSame
                    ? 'Passwords do not match.'
                    : 'Please provide a valid password.'}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Row} controlId="signupCheckbox">
                <Form.Check>
                  <Form.Check.Input
                    onChange={(e: any) => setCheckbox(e.target.checked)}
                    checked={checkbox}
                    isValid={!!checkbox}
                    required
                  />
                  <Form.Check.Label>
                    {' '}
                    I agree to the&nbsp;
                    <span className="link-content">
                      <a
                        target="_blank"
                        href="/privacy-policy"
                        className="link"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </Form.Check.Label>
                  <Form.Control.Feedback type="invalid">
                    Terms must be accepted before submitting.
                  </Form.Control.Feedback>
                </Form.Check>
              </Form.Group>
              <Button variant="secondary" type="submit" block>
                Sign Up
              </Button>
            </Form>
            <Row>
              <Col className="link-content mt-4">
                Already have an account?&ensp;
                <a href="/login" className="link">
                  Sign in!
                </a>
              </Col>
            </Row>
          </div>

          <div className={showConfirmSignup ? 'auth-container' : 'd-none'}>
            <Row className="mb-4">
              <Col>
                <div className="heading">Verify Your Email Address</div>
              </Col>
            </Row>
            <Row>
              <Col className="link-content mb-2">
                We have sent an email to <span className="link">{email}</span>{' '}
                to confirm the validity of your email address. After receiving
                the email, use the code provided to complete your registration.
              </Col>
            </Row>
            <Form
              noValidate
              validated={codeFormValidated}
              onSubmit={confirmEmail}
            >
              <Form.Group as={Row} controlId="confirmCode">
                <Form.Control
                  type="number"
                  placeholder="Code"
                  onChange={(e: any) => setCode(e.target.value)}
                  value={code}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid code.
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="secondary" type="submit" block>
                Submit
              </Button>
            </Form>
            <Row>
              <Col className="link-content mt-4">
                Did not received an email?&ensp;
                {enableResend ? (
                  <a
                    type="button"
                    className="link"
                    onClick={() => reSendconfirmationEmail()}
                  >
                    Resend Confirmation Email
                  </a>
                ) : (
                  <span className="link">Resend Confirmation Email</span>
                )}
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </Layout>
  );
}
