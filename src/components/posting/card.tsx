import { Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { getDateInMMYYYYFormat } from '../../lib/helper';

type Props = {
  products: any;
  length: number;
  sort?: string;
  search?: string;
};

export default function Card({
  products,
  length,
  sort = '',
  search = ''
}: Props) {
  let data = products.docs ? products.docs : products;
  if (length) {
    data = data.slice(0, length);
  }

  return (
    <>
      <div className="d-none d-md-block">
        {data.map((product: any) => {
          return (
            <Link
              href={`/postings/${product.id}`}
              key={sort + search + product.id}
            >
              <Row className="bg-bottom py-4 clickable">
                <Col className="image-col">
                  <div className="image">
                    <Image
                      src={
                        product.images.length > 0
                          ? product.images[0].url
                          : '/images/listing-img-1.jpg'
                      }
                      width={260}
                      height={180}
                      alt="listing item image"
                      layout="responsive"
                    />
                  </div>
                </Col>
                <Col md={10}>
                  <Row>
                    <Col className="d-flex justify-content-between">
                      <div className="id">
                        ID #{product.id}-
                        {getDateInMMYYYYFormat(product.listedDate)}
                        {product.commission && ` (${product.commission})`}
                      </div>
                    </Col>
                  </Row>
                  <Row className="">
                    <Col className="d-flex justify-content-between">
                      <div className="heading heading-name">{product.name}</div>
                      <div className="heading">
                        {product.price
                          ? product.price === 'Unpriced'
                            ? 'Unpriced'
                            : parseInt(product.price) > 0
                            ? '$' + parseInt(product.price).toLocaleString()
                            : ''
                          : ''}
                      </div>
                    </Col>
                  </Row>
                  <Row className="">
                    <Col className="d-flex justify-content-between">
                      <div className="have-wants">
                        Have:
                        {product.haveCategory?.map((item: string) => {
                          return (
                            <span className={'logo ml-2 ' + item} key={item}>
                              {item}
                            </span>
                          );
                        })}
                      </div>
                      <div className="have-wants">
                        Wants:
                        {product.wantCategory?.map((item: string) => {
                          return (
                            <span className={'logo ml-2 ' + item} key={item}>
                              {item}
                            </span>
                          );
                        })}
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col className="d-flex justify-content-between">
                      <div className="desc">{product.haveShortDesc}</div>
                      {product.proActive ? (
                        <div>
                          <span className="pro-active">Pro Active</span>
                        </div>
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Link>
          );
        })}
      </div>
      <Row className="d-flex d-md-none d-lg-none">
        {data.map((product: any) => {
          return (
            <Link href={`/postings/${product.id}`} key={product.id}>
              <Col xs={12} sm={6} className="bg-right bg-bottom py-2">
                <Row>
                  <Col className="image">
                    <Image
                      src={
                        product.images.length > 0
                          ? product.images[0].url
                          : '/images/listing-img-1.jpg'
                      }
                      width={260}
                      height={180}
                      alt="listing item image"
                      layout="responsive"
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col className="d-flex justify-content-between">
                    <div className="id">
                      ID #{product.id}-
                      {getDateInMMYYYYFormat(product.listedDate)}
                      {product.commission && ` (${product.commission})`}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col className="d-flex justify-content-between">
                    <div className="heading">{product.name}</div>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col className="d-flex justify-content-left">
                    <div className="price-heading">
                      {product.price
                        ? product.price === 'Unpriced'
                          ? 'Unpriced'
                          : parseInt(product.price) > 0
                          ? '$' + parseInt(product.price).toLocaleString()
                          : ''
                        : ''}
                    </div>
                    {product.proActive ? (
                      <div>
                        <span className="pro-active ml-2">Pro Active</span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Col>
            </Link>
          );
        })}
      </Row>
    </>
  );
}
