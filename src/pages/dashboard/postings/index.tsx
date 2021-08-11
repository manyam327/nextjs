import {
  Container,
  Row,
  Col,
  Nav,
  Form,
  Table,
  DropdownButton,
  Dropdown,
  Button
} from 'react-bootstrap';
import Layout from '../../../components/Layout';
import BasicMeta from '../../../components/meta/BasicMeta';
import ArrowRight from './../../../assets/svg/Arrow-right.svg';
import { useRouter } from 'next/router';
import { DropdownEventType, ListingStatus } from '../../../lib/constant';
import ConfirmDeleteModal from '../../../components/dashboard/confirm-delete-modal';
import { useEffect, useState } from 'react';
import fetcher from '../../../lib/get-fetcher';
import useSWR from 'swr';
import patchFetcher from '../../../lib/patch-fetcher';
import deleteFetcher from '../../../lib/delete-fetcher';
import Pagination from '../../../components/posting/pagination';
import CountUp from 'react-countup';

const statusData: any = {
  0: 'draft',
  1: 'active',
  2: 'closed',
  3: 'deleted'
};

type Props = {
  alertRef: any;
};

export default function Postings({ alertRef }: Props) {
  const [selectedList, setSelectedList] = useState(-1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  const url = '/dashboard/postings';
  const title = 'Account Postings';
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
  let user_id = null;
  if (process.browser) {
    // Client-side-only code
    user_id = sessionStorage.getItem('_id');
  }
  const fetchServerUrl = `${serverUrl}/product/user/${user_id}`;

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

  const handleOnSelect = async (eventKey: string, id: number) => {
    const token = sessionStorage.getItem('token');
    const headers = {
      headers: {
        Authorization: 'Bearer ' + token
      }
    };
    let fetchUrl = `${serverUrl}/product`;

    if (eventKey === DropdownEventType.edit) {
      router.push(`/dashboard/postings/${id}`);
    } else if (eventKey === DropdownEventType.unpublish) {
      fetchUrl = `${fetchUrl}/${id}`;
      await patchFetcher(
        fetchUrl,
        { status: ListingStatus.draft },
        headers,
        alertRef
      );
      mutate();
    } else if (eventKey === DropdownEventType.close) {
      fetchUrl = `${fetchUrl}/${id}`;
      await patchFetcher(
        fetchUrl,
        { status: ListingStatus.closed },
        headers,
        alertRef
      );
      mutate();
    } else if (eventKey === DropdownEventType.delete) {
      if (selectedList !== -1) {
        setSelectedList(-1);
        fetchUrl = `${fetchUrl}/${id}`;
        await deleteFetcher(fetchUrl, headers, alertRef);
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
          <div className="d-flex justify-content-between heading mb-4">
            <span>Account</span>
            <span>
              <Button
                variant="secondary"
                onClick={() => router.push('/dashboard/postings/new')}
              >
                Add New Posting
              </Button>
            </span>
          </div>

          <div className="account-container">
            <Row>
              <Col lg={2} className="menu-container d-none d-lg-block pt-2">
                <Nav
                  defaultActiveKey="/dashboard/postings"
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
                        Active Postings
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
                          <option value="-id">Date Added</option>
                          <option value="status">Status</option>
                          <option value="-proActive">Pro-Active</option>
                          <option value="price">Price - Low to High</option>
                          <option value="-price">Price - High to Low</option>
                        </Form.Control>
                      </div>
                    </div>
                    <div className="listing-table mt-3">
                      <Table responsive className="mb-0">
                        <thead>
                          <tr>
                            <th>ID #</th>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Date Added</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {error && <p>Error! {error}</p>}
                          {data &&
                            data.docs.map((item: any, index: number) => (
                              <tr key={index}>
                                <td>ID #{item.id}</td>
                                <td>{item.name}</td>
                                <td>{statusData[item.status]}</td>
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
                                <td className="align-middle">
                                  <DropdownButton
                                    id="dropdown-action-button"
                                    drop="left"
                                    variant="secondary"
                                    title="Manage"
                                    onSelect={(eventKey: any) => {
                                      handleOnSelect(eventKey, item.id);
                                      setSelectedList(item.id);
                                    }}
                                  >
                                    <Dropdown.Item
                                      eventKey="1"
                                      disabled={
                                        item.status === ListingStatus.deleted
                                      }
                                    >
                                      Edit
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      eventKey="2"
                                      disabled={
                                        item.status === ListingStatus.draft
                                      }
                                    >
                                      Unpublish
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      eventKey="3"
                                      disabled={
                                        item.status === ListingStatus.closed
                                      }
                                    >
                                      Close Posting
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      eventKey="4"
                                      disabled={
                                        item.status === ListingStatus.deleted
                                      }
                                    >
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
          setSelectedList(-1);
          setShowDeleteModal(false);
        }}
        onDelete={() => {
          handleOnSelect('4', selectedList);
          setShowDeleteModal(false);
        }}
        from="Posting"
      />
    </Layout>
  );
}
