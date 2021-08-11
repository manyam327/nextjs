import { Container, Form, Col, Button } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { useRouter } from 'next/router';

import Layout from '../../components/Layout';
import BasicMeta from '../../components/meta/BasicMeta';
import OpenGraphMeta from '../../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../../components/meta/TwitterCardMeta';
import Card from '../../components/posting/card';
import fetcher from '../../lib/get-fetcher';

export default function Postings() {
  const url = '/postings';
  const title = 'Postings';
  const productServerUrl: any = process.env.NEXT_PUBLIC_SERVER_URL + '/product';

  const [search, setSearch] = useState('');
  const [fetchUrl, setFetchUrl] = useState(productServerUrl);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>({
    docs: [],
    hasNextPage: false,
    limit: 10,
    totalDocs: 0
  });
  const router = useRouter();
  const { error, data: resData } = useSWR(fetchUrl, fetcher);

  let token = null;
  if (process.browser) {
    // Client-side-only code
    token = sessionStorage.getItem('token');
  }

  useEffect(() => {
    if (resData) {
      if (resData.page === 1) {
        setData(resData);
      } else if (resData.page !== data.page) {
        const docs = [...data.docs, ...resData.docs];
        resData.docs = docs;
        setData(resData);
      }
    }
  }, [resData]);

  useEffect(() => {
    let fetchUrl = productServerUrl;
    if (sort !== '') {
      fetchUrl += `?sort=${sort}`;
    }
    fetchUrl += fetchUrl.includes('?') ? '&' : '?';
    if (search !== '') {
      fetchUrl += `search=${search}`;
    }
    setFetchUrl(fetchUrl);
  }, [sort]);

  useEffect(() => {
    let fetchUrl = productServerUrl;
    if (sort !== '') {
      fetchUrl += `?sort=${sort}`;
    }
    fetchUrl += fetchUrl.includes('?') ? '&' : '?';
    fetchUrl += `page=${page}`;
    if (search !== '') {
      fetchUrl += `search=${search}`;
    }
    setFetchUrl(fetchUrl);
  }, [page]);

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      let fetchUrl = productServerUrl;
      if (sort !== '') {
        fetchUrl += `?sort=${sort}`;
      }
      fetchUrl += fetchUrl.includes('?') ? '&' : '?';
      if (event.target.value !== '') {
        fetchUrl += `search=${event.target.value}`;
      }
      setSearch(event.target.value);
      setFetchUrl(fetchUrl);
      console.log('enter press here! ');
    }
  };

  const onselectchange = (event: any) => {
    setSort(event.target.value);
  };

  const onPageChange = (pageNumber: number) => {
    console.log(pageNumber);
    setPage(pageNumber);
  };

  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />

      <div className="listing-section">
        <Container fluid="md">
          <div className="search-section pb-4 pt-4">
            <div className="heading mb-2">Explore Postings</div>
            <Form>
              <Form.Row>
                <Col xs={12} sm={6} md={4}>
                  <Form.Control
                    type="text"
                    placeholder="Search Postings"
                    // value={search}
                    // onChange={(e: any) => setSearch(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                </Col>
                <Col>
                  {token && (
                    <span className="float-right">
                      <Button
                        variant="secondary"
                        onClick={() => router.push('/dashboard/postings/new')}
                      >
                        Add New Posting
                      </Button>
                    </span>
                  )}
                </Col>
              </Form.Row>
            </Form>
          </div>
          <div className="listing-table">
            <div className="listing-table-heading pb-3">
              <div className="results">
                <CountUp
                  start={0}
                  end={data ? data.totalDocs : 0}
                  separator=","
                />{' '}
                Results
              </div>
              <div className="sort d-none d-sm-block">
                <Form.Control
                  as="select"
                  size="sm"
                  custom
                  onChange={onselectchange}
                  value={sort === '' ? '-id' : sort}
                >
                  <option value="-id">Relevance</option>
                  <option value="id">Date Added</option>
                  <option value="-proActive">Pro-Active</option>
                  <option value="price">Price - Low to High</option>
                  <option value="-price">Price - High to Low</option>
                </Form.Control>
              </div>
            </div>

            {data && (
              <InfiniteScroll
                dataLength={data.docs.length} //This is important field to render the next data
                next={() => onPageChange(data.nextPage)}
                hasMore={data ? data.hasNextPage : false}
                loader={<h4>Loading...</h4>}
              >
                <div className="listing-row">
                  <Card
                    products={data}
                    length={data.docs.length}
                    sort={sort}
                    search={search}
                  />
                </div>
              </InfiniteScroll>
            )}
          </div>
        </Container>
      </div>
    </Layout>
  );
}

// This gets called on every request
// export async function getServerSideProps() {
//   // Fetch data from external API
//   const fetchUrl = `${process.env.SERVER_URL}/product`;
//   const res = await fetch(fetchUrl);
//   const data = await res.json();

//   // Pass data to the page via props
//   return { props: { data } };
// }
