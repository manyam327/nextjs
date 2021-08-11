import { Container, Row, Col, Nav, Form, Button } from 'react-bootstrap';
import Layout from './../../components/Layout';
import BasicMeta from './../../components/meta/BasicMeta';

import ArrowRight from './../../assets/svg/Arrow-right.svg';
import { useRouter } from 'next/router';
import fetcher from '../../lib/get-fetcher';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const url = '/dashboard';
  const title = 'Account Profile';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  let token, _id;
  const userServerUrl: any = process.env.NEXT_PUBLIC_SERVER_URL + '/user/';
  const [data, setData] = useState<any>({});

  useEffect(() => {
    token = sessionStorage.getItem('token');
    if (!token) {
      sessionStorage.setItem(
        'message',
        'Please login first to access dashboard!'
      );
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    token = sessionStorage.getItem('token');
    _id = sessionStorage.getItem('_id');

    const fetchUrl = userServerUrl + _id;
    fetcher(fetchUrl, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then((res: any) => {
      if (res && res.user) {
        setData(res.user);
        sessionStorage.setItem('user', JSON.stringify(res.user));
      }
    });
  });

  useEffect(() => {
    if (data && data.name && data.email) {
      setName(data.name);
      setEmail(data.email);
    }
  }, [data]);

  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />

      <div className="account-section">
        <Container>
          <div className="heading mb-4">Account</div>

          <div className="account-container">
            <Row>
              <Col lg={2} className="menu-container d-none d-lg-block pt-2">
                <Nav defaultActiveKey="/dashboard" className="flex-column">
                  <Nav.Link
                    href="/dashboard"
                    className="d-flex justify-content-between"
                  >
                    <span>Profile</span>
                    <span className="align-middle">
                      <ArrowRight width={6} height={10} />
                    </span>
                  </Nav.Link>
                  <Nav.Link
                    href="/dashboard/postings"
                    className="d-flex justify-content-between"
                  >
                    <span>Postings</span>
                    <span className="align-middle">
                      <ArrowRight width={6} height={10} />
                    </span>
                  </Nav.Link>
                  <Nav.Link
                    href="/dashboard/messages"
                    className="d-flex justify-content-between"
                  >
                    <span>Messages</span>
                    <span className="align-middle">
                      <ArrowRight width={6} height={10} />
                    </span>
                  </Nav.Link>
                </Nav>
              </Col>
              <Col xs={12} lg={10}>
                <div className="account-content-container">
                  <div className="account-dropdown-menu d-block d-md-none">
                    <Form.Control
                      as="select"
                      size="sm"
                      custom
                      onChange={(event) => router.push(event.target.value)}
                      value={router.route}
                    >
                      <option value="/dashboard">Profile</option>
                      <option value="/dashboard/postings">Postings</option>
                      <option value="/dashboard/messages">Messages</option>
                    </Form.Control>
                  </div>

                  <div className="account-profile-section">
                    <div className="profile-section-heading">
                      Account Profile
                    </div>
                    <div className="user-info mt-4">
                      <div className="user-info-heading">User Information</div>
                      <Row className="mt-2">
                        <Col sm={12} md={6}>
                          <Form>
                            <Form.Group controlId="userInfoEmail">
                              <Form.Label>Name</Form.Label>
                              <Form.Control
                                type="text"
                                onChange={(e: any) => setName(e.target.value)}
                                value={name}
                              />
                            </Form.Group>
                            <Form.Group controlId="userInfoPassword">
                              <Form.Label>Email Address</Form.Label>
                              <Form.Control
                                type="text"
                                onChange={(e: any) => setEmail(e.target.value)}
                                value={email}
                              />
                            </Form.Group>
                          </Form>
                        </Col>
                      </Row>
                    </div>
                    <div className="auth-info mt-4">
                      <div className="auth-info-heading">Change Password</div>
                      <Row className="mt-2">
                        <Col sm={12} md={6}>
                          <Form>
                            <Form.Group controlId="authInfoCurrentPassword">
                              <Form.Label>Current Password</Form.Label>
                              <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group controlId="authInfoNewPassword">
                              <Form.Label>New Password</Form.Label>
                              <Form.Control type="text" />
                            </Form.Group>
                            <Form.Group controlId="authInfoRetypePassword">
                              <Form.Label>Retype Password</Form.Label>
                              <Form.Control type="text" />
                            </Form.Group>
                            <Button variant="secondary" type="submit" block>
                              Save Changes
                            </Button>
                          </Form>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </Layout>
  );
}
