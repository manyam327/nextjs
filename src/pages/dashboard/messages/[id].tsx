import { Container, Row, Col, Nav, Form, Button } from 'react-bootstrap';
import Layout from '../../../components/Layout';
import BasicMeta from '../../../components/meta/BasicMeta';
import ArrowRight from '../../../assets/svg/Arrow-right.svg';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import fetcher from '../../../lib/get-fetcher';
import patchFetcher from '../../../lib/patch-fetcher';
import { useEffect } from 'react';
import { MessageStatus } from '../../../lib/constant';

type Props = {
  alertRef: any;
};

let btn: any;

export default function MessageView({ alertRef }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const url = '/dashboard/messages';
  const title = 'Message';

  const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/messages/${id}`;
  const { error, data } = useSWR(fetchUrl, fetcher);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      sessionStorage.setItem(
        'message',
        'Please login first to access dashboard!'
      );
      router.push('/login');
    }
  }, []);

  useEffect(() => {
    if (data && data?.status === MessageStatus.unread) {
      patchRequest(MessageStatus.read);
    }
  }, [data]);

  const patchRequest = async (status: number) => {
    const token = sessionStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: 'Bearer ' + token
      }
    };
    let fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/user/messages/${id}`;
    await patchFetcher(fetchUrl, { status }, headers, alertRef);
  };

  const deleteMessage = async () => {
    patchRequest(MessageStatus.delete);
  };

  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />

      <div className="account-section">
        <Container>
          <div className="account-container">
            <Row>
              <Col lg={2} className="menu-container d-none d-lg-block pt-2">
                <Nav
                  defaultActiveKey="/dashboard/messages"
                  className="flex-column"
                >
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
                  <div className="account-dropdown-menu d-flex justify-content-between">
                    <div>
                      <div className="d-inline-block d-md-none">
                        <Form.Control
                          as="select"
                          size="sm"
                          custom
                          onChange={(event) => router.push(event.target.value)}
                          value={url}
                        >
                          <option value="/dashboard">Profile</option>
                          <option value="/dashboard/postings">Postings</option>
                          <option value="/dashboard/messages">Messages</option>
                        </Form.Control>
                      </div>

                      <Link href="/dashboard/messages">
                        <div className="view-listing-text ml-2">
                          View All Messages
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="view-list-section">
                    <Row className="mb-4 pb-4">
                      <Col>
                        <div className="item-heading mb-2">Date</div>
                        <div className="item-value">
                          {new Date(data?.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            }
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-4 pb-4">
                      <Col xs={12} md={6}>
                        <div className="item-heading mb-2">Name</div>
                        <div className="item-value">{data?.name}</div>
                      </Col>
                      <Col xs={12} md={6}>
                        <div className="item-heading mb-2">Email</div>
                        <div className="item-value">{data?.email}</div>
                      </Col>
                    </Row>
                    <Row className="mb-4 pb-4 ">
                      <Col>
                        <div className="item-heading mb-2">Message</div>
                        <div className="item-value">{data?.message}</div>
                      </Col>
                    </Row>
                    <Button
                      variant="secondary"
                      type="button"
                      className="cancel-btn ml-3"
                      onClick={() => deleteMessage()}
                    >
                      Delete
                    </Button>
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
