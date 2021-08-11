import Layout from '../../components/Layout';
import BasicMeta from '../../components/meta/BasicMeta';
import OpenGraphMeta from '../../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../../components/meta/TwitterCardMeta';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useState } from 'react';
import postFetcher from './../../lib/post-fetcher';
import { CodeSentType } from './../../lib/constant';

type Props = {
  alertRef: any;
};

export default function ForgotPass({ alertRef }: Props) {
  const url = '/forgot-pass';
  const title = 'Forgot Password';

  const router = useRouter();
  const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);

  const [email, setEmail] = useState('');
  const [emailFormValidated, setEmailFormValidated] = useState(false);
  const [hash, setHash] = useState(null);

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordSame, setIsPasswordSame] = useState(true);
  const [validated, setValidated] = useState(false);

  const emailSubmit = async (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    const form = event.currentTarget;

    setEmailFormValidated(true);
    if (form.checkValidity() === false) {
      return;
    }

    let fetchUrl = process.env.NEXT_PUBLIC_SERVER_URL + '/auth/code-sent';
    await postFetcher(
      fetchUrl,
      {
        username: email,
        type: CodeSentType.ForgotPassword
      },
      {},
      alertRef
    ).then((res) => {
      if (res && res.hash) {
        setHash(res.hash);
        setShowChangePasswordForm(true);
      }
    });
  };

  const changePasswordFormSubmit = async (event: any) => {
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

    let fetchUrl = process.env.NEXT_PUBLIC_SERVER_URL + '/auth/forgot-pass';
    await postFetcher(
      fetchUrl,
      {
        username: email,
        password,
        hash,
        otp: code
      },
      {},
      alertRef
    ).then((res) => {
      if (res && res.id) {
        router.push('/login');
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
          <div className={showChangePasswordForm ? 'd-none' : 'auth-container'}>
            <Row className="mb-4">
              <Col>
                <div className="heading">Password Reset</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <div className="desc">
                  Please enter the email address you’d like your password reset
                  information sent to:
                </div>
              </Col>
            </Row>
            <Form
              noValidate
              validated={emailFormValidated}
              onSubmit={emailSubmit}
            >
              <Form.Group as={Row} controlId="forgotPassEmail">
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
              <Button variant="secondary" type="submit" block>
                Reset Password
              </Button>
            </Form>
            <Row>
              <Col className="link-content mt-4">
                <a href="/login" className="link">
                  Back To Login
                </a>
              </Col>
            </Row>
          </div>

          <div className={showChangePasswordForm ? 'auth-container' : 'd-none'}>
            <Row className="mb-4">
              <Col>
                <div className="heading">Password Reset</div>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col>
                <div className="desc">
                  Please enter the code received on your email address{' '}
                  <span className="link">{email}</span> and new password:
                </div>
              </Col>
            </Row>
            <Form
              noValidate
              validated={validated}
              onSubmit={changePasswordFormSubmit}
            >
              <Form.Group as={Row} controlId="forgotPassCode">
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
              <Form.Group as={Row} controlId="forgotPassPassword">
                <Form.Control
                  type="password"
                  placeholder="New Password"
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
              <Form.Group as={Row} controlId="forgotPassConfirmPassword">
                <Form.Control
                  type="password"
                  placeholder="Confirm New Password"
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
              <Button variant="secondary" type="submit" block>
                Submit
              </Button>
            </Form>
            <Row>
              <Col className="link-content mt-4">
                <a href="/login" className="link">
                  Back To Login
                </a>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </Layout>
  );
}
