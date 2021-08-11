import {
  Container,
  Row,
  Col,
  Nav,
  Form,
  Table,
  DropdownButton,
  Dropdown
} from 'react-bootstrap';
import Layout from './../../../components/Layout';
import BasicMeta from './../../../components/meta/BasicMeta';

import ArrowRight from './../../../assets/svg/Arrow-right.svg';
import { useRouter } from 'next/router';
import {
  MessageDropdownEventType,
  MessageStatus
} from './../../../lib/constant';
import ConfirmDeleteModal from './../../../components/dashboard/confirm-delete-modal';
import { useEffect, useState } from 'react';
import fetcher from './../../../lib/get-fetcher';
import useSWR from 'swr';
import patchFetcher from '../../../lib/patch-fetcher';
import Pagination from './../../../components/posting/pagination';
import CountUp from 'react-countup';

const statusData: any = {
  0: 'Unread',
  1: 'Read'
};

type Props = {
  alertRef: any;
};

export default function Messages({ alertRef }: Props) {
  const [selectedMessage, setSelectedMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();
  const url = '/dashboard/messages';
  const title = 'Account Messages';

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  let user_id: any = null;
  if (process.browser) {
    // Client-side-only code
    user_id = sessionStorage.getItem('_id');
  }
  const fetchServerUrl = `${serverUrl}/user/messages/${user_id}`;

  const [fetchUrl, setFetchUrl] = useState(fetchServerUrl);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const { error, data, mutate } = useSWR(fetchUrl, fetcher);

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
    let fetchUrl = fetchServerUrl;
    if (sort !== '') {
      fetchUrl += `?sort=${sort}`;
    }
    setFetchUrl(fetchUrl);
  }, [sort]);

  useEffect(() => {
    let fetchUrl = fetchServerUrl;
    if (sort !== '') {
      fetchUrl += `?sort=${sort}`;
    }
    fetchUrl += fetchUrl.includes('?') ? '&' : '?';
    fetchUrl += `page=${page}`;
    setFetchUrl(fetchUrl);
  }, [page]);

  const onselectchange = (event: any) => {
    setSort(event.target.value);
  };

  const handleOnSelect = async (eventKey: string, id: string) => {
    const token = sessionStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: 'Bearer ' + token
      }
    };
    let fetchUrl = `${serverUrl}/user/messages/${id}`;
    if (eventKey === MessageDropdownEventType.view) {
      router.push(`/dashboard/messages/${id}`);
    } else if (eventKey === MessageDropdownEventType.unread) {
      await patchFetcher(
        fetchUrl,
        { status: MessageStatus.unread },
        headers,
        alertRef
      );
      mutate();
    } else if (eventKey === MessageDropdownEventType.read) {
      await patchFetcher(
        fetchUrl,
        { status: MessageStatus.read },
        headers,
        alertRef
      );
      mutate();
    } else if (eventKey === MessageDropdownEventType.delete) {
      if (selectedMessage !== '') {
        setSelectedMessage('');
        await patchFetcher(
          fetchUrl,
          { status: MessageStatus.delete },
          headers,
          alertRef
        );
        mutate();
      } else {
        setShowDeleteModal(true);
      }
    }
  };

  const onPageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };
  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />

      <div className="account-section">
        <Container>
          <div className="heading mb-4">Account</div>

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

                  <div className="account-listing-section">
                    <div className="listing-table-heading mt-4 flex-column flex-md-row">
                      <div className="result-heading">
                        <CountUp
                          start={0}
                          end={data ? data.totalDocs : 0}
                          separator=","
                        />{' '}
                        Messages
                        <small>
                          (displaying{' '}
                          {data
                            ? `${(data.page - 1) * 10 + 1} - ${
                                data.page * 10 > data.totalDocs
                                  ? data.totalDocs
                                  : data.page * 10
                              }`
                            : '-'}
                          )
                        </small>
                      </div>
                      <div className="sort-dropdown-listings">
                        <Form.Control
                          as="select"
                          size="sm"
                          custom
                          onChange={onselectchange}
                          value={sort === '' ? '-id' : sort}
                        >
                          <option value="status">Status</option>
                          <option value="-createdAt">Date Added</option>
                        </Form.Control>
                      </div>
                    </div>
                    <div className="listing-table mt-3">
                      <Table responsive className="mb-0">
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Name</th>
                            <th>Status</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {error && <p>Error! {error}</p>}
                          {data &&
                            data.docs.map((item: any, index: number) => (
                              <tr key={index}>
                                <td>
                                  {new Date(item.createdAt).toLocaleDateString(
                                    'en-US',
                                    {
                                      year: 'numeric',
                                      month: '2-digit',
                                      day: '2-digit'
                                    }
                                  )}
                                </td>
                                <td
                                  onClick={() => handleOnSelect('1', item._id)}
                                >
                                  {item.name}
                                </td>
                                <td>{statusData[item.status]}</td>
                                <td className="align-middle">
                                  <DropdownButton
                                    id="dropdown-action-button"
                                    drop="left"
                                    variant="secondary"
                                    title="..."
                                    onSelect={(eventKey: any) => {
                                      handleOnSelect(eventKey, item._id);
                                      setSelectedMessage(item._id);
                                    }}
                                  >
                                    <Dropdown.Item eventKey="1">
                                      View
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      eventKey="2"
                                      disabled={
                                        item.status === MessageStatus.unread
                                      }
                                    >
                                      Mark as Unread
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      eventKey="3"
                                      disabled={
                                        item.status === MessageStatus.read
                                      }
                                    >
                                      Marke as Read
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="4">
                                      Delete
                                    </Dropdown.Item>
                                  </DropdownButton>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </Table>
                    </div>

                    {data && (
                      <div className="pagination">
                        <Pagination data={data} onChange={onPageChange} />
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <ConfirmDeleteModal
        show={showDeleteModal}
        onHide={() => {
          setSelectedMessage('');
          setShowDeleteModal(false);
        }}
        onDelete={() => {
          handleOnSelect('3', selectedMessage);
          setShowDeleteModal(false);
        }}
        from="Message"
      />
    </Layout>
  );
}
