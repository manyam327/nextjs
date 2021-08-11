import Layout from '../../components/Layout';
import BasicMeta from '../../components/meta/BasicMeta';
import OpenGraphMeta from '../../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../../components/meta/TwitterCardMeta';
import ArrowLeft from './../../assets/svg/Arrow-left.svg';
import { Container, Button, Row, Col, Carousel } from 'react-bootstrap';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Facebook from './../../assets/svg/Facebook.svg';
import Twitter from './../../assets/svg/Twitter.svg';
import CopyLink from './../../assets/svg/Copy-Link.svg';
import Image from 'next/image';
import Card from '../../components/posting/card';
import { useState } from 'react';
import PropertyInquiryModal from '../../components/posting/property-inquiry';
import MakeAnOfferModal from '../../components/posting/make-an-offer';
import fetcher from '../../lib/get-fetcher';
import useSWR from 'swr';
import { getDateInMMYYYYFormat } from '../../lib/helper';
import SuccessModal from '../../components/Success-Modal';

const images = [
  '/images/listing-img-1.jpg',
  '/images/listing-img-2.jpg',
  '/images/listing-img-3.jpg'
];

type Props = {
  alertRef: any;
};
export default function ListingItem({ alertRef }: Props) {
  const [selectedProduct, setSelectedProduct] = useState({});
  const [showPropertyInquiryModal, setShowPropertyInquiryModal] =
    useState(false);
  const [showMakeAnOfferModal, setShowMakeAnOfferModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const url = '/postings/';
  const title = 'Postings';
  const router = useRouter();
  const { id } = router.query;

  const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/product`;
  const { error, data } = useSWR(fetchUrl, fetcher);

  const { error: productError, data: product } = useSWR(
    `${fetchUrl}/${id}`,
    fetcher
  );

  const onModalHide = (message: string) => {
    if (message && message.length > 0) {
      setMessage(message);
      setShowSuccessModal(true);
    }
    setShowMakeAnOfferModal(false);
    setShowPropertyInquiryModal(false);
  };

  const getImages = () => {
    let images = [];
    if (
      product &&
      product.product &&
      product.product.images &&
      product.product.images.length > 0
    ) {
      images = product.product.images;
    } else {
      images.push({ url: '/images/listing-img-1.jpg' });
    }
    return images;
  };

  return (
    <Layout url={url} token={token}>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />

      <div className="listitem-section">
        <Container fluid="md">
          <div className="view-listing">
            <Button
              variant="outline-light"
              onClick={() => {
                router.push('/postings');
              }}
              style={{ display: 'inline' }}
            >
              <ArrowLeft width={6} height={11} />
            </Button>
            <Link href="/postings">
              <div className="view-listing-text ml-2">View All Postings</div>
            </Link>
          </div>

          {productError && <p>Error! {productError}</p>}
          {product && (
            <div className="list-details pb-4">
              <Row className="mt-4">
                <Col>
                  <div className="id">
                    &nbsp;ID #{product.product.id}-
                    {getDateInMMYYYYFormat(product.product.listedDate)}
                    {product.product.commission &&
                      ` (${product.product.commission})`}
                  </div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <div className="heading">{product.product.name}</div>
                </Col>
              </Row>
              <Row className="mt-2">
                <Col sm={12} lg={8} className="d-flex justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="price">
                      {product.product?.price
                        ? product.product?.price === 'Unpriced'
                          ? 'Unpriced'
                          : parseInt(product.product?.price) > 0
                          ? '$' +
                            parseInt(product.product?.price).toLocaleString()
                          : ''
                        : ''}
                    </div>
                    {product.product?.proActive ? (
                      <div>
                        <span className="pro-active ml-3">Pro Active</span>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="d-none d-sm-flex align-items-center">
                    <div className="have-wants">
                      Have:
                      {product.product?.haveCategory.map((item: string) => {
                        return (
                          <span className={'logo ml-2 ' + item} key={item}>
                            {item}
                          </span>
                        );
                      })}
                    </div>
                    <div className="have-wants ml-4">
                      Wants:
                      {product.product?.wantCategory.map((item: string) => {
                        return (
                          <span className={'logo ml-2 ' + item} key={item}>
                            {item}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </Col>
                <Col sm={12} lg={4} className="d-none d-xl-flex">
                  <div className="social-button-group">
                    {/* <button className="facebook">
                      <Facebook width={15} height={15} />
                      &ensp;share
                    </button>
                    <button className="twitter ml-2">
                      <Twitter width={15} height={15} />
                      &ensp;tweet
                    </button>
                    <button className="copy-link ml-2">
                      <CopyLink width={15} height={15} />
                      &ensp;copy link
                    </button> */}
                  </div>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col sm={12} lg={8} className="image-col">
                  <div className="image">
                    <Carousel>
                      {getImages().map((item: any) => (
                        <Carousel.Item interval={2000} key={Math.random()}>
                          {/* <div className="image"> */}
                          <Image
                            src={item.url}
                            width={260}
                            height={180}
                            alt="listing item image"
                            layout="responsive"
                          />
                          {/* </div> */}
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                </Col>
                <Col sm={12} lg={4} className="bg-top">
                  <div className="details-div mt-3">
                    <div>
                      <div className="heading">Have</div>
                      <div className="desc mt-3">
                        {product.product.haveLongDesc}
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="heading">Want</div>
                      <div className="desc mt-3">
                        {product.product.wantDetails}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 align-bottom">
                    <Button
                      variant="secondary"
                      type="submit"
                      onClick={() => {
                        setSelectedProduct(product.product);
                        setShowMakeAnOfferModal(true);
                      }}
                      block
                    >
                      Rexnet Offer Form
                    </Button>
                  </div>
                  <div className="mt-4 align-bottom">
                    <Button
                      className="cancel-btn"
                      variant="secondary"
                      type="submit"
                      onClick={() => {
                        setSelectedProduct(product.product);
                        setShowPropertyInquiryModal(true);
                      }}
                      block
                    >
                      Contact Owner or Agent
                    </Button>
                  </div>
                </Col>
                <Col
                  sm={12}
                  className="d-flex d-xl-none mt-3 pt-3 bg-top justify-content-center"
                >
                  <div className="social-button-group ">
                    {/* <button className="facebook">
                      <Facebook width={15} height={15} />
                      &ensp;share
                    </button>
                    <button className="twitter ml-2">
                      <Twitter width={15} height={15} />
                      &ensp;tweet
                    </button>
                    <button className="copy-link ml-2">
                      <CopyLink width={15} height={15} />
                      &ensp;copy link
                    </button> */}
                  </div>
                </Col>
              </Row>
            </div>
          )}

          <div className="similar-listing">
            <div className="similar-listing-heading py-4">Similar Postings</div>
            {error && <p>Error! {error}</p>}
            {data && (
              <div className="listing-row">
                <Card products={data} length={4} />
              </div>
            )}
          </div>
        </Container>
      </div>

      <PropertyInquiryModal
        show={showPropertyInquiryModal}
        onHide={(m: string) => onModalHide(m)}
        setToken={(t: string) => setToken(t)}
        product={selectedProduct}
        alertRef={alertRef}
      />

      <MakeAnOfferModal
        show={showMakeAnOfferModal}
        onHide={(m: string) => onModalHide(m)}
        setToken={(t: string) => setToken(t)}
        product={selectedProduct}
        alertRef={alertRef}
      />

      <SuccessModal
        show={showSuccessModal}
        onHide={() => setShowSuccessModal(false)}
        message={message}
      ></SuccessModal>
    </Layout>
  );
}
