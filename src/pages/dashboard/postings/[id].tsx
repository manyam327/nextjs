import {
  Container,
  Row,
  Col,
  Nav,
  Form,
  Button,
  InputGroup,
  ProgressBar
} from 'react-bootstrap';
import Layout from '../../../components/Layout';
import BasicMeta from '../../../components/meta/BasicMeta';
import ArrowRight from '../../../assets/svg/Arrow-right.svg';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useSWR from 'swr';
import fetcher from '../../../lib/get-fetcher';
import postFetcher from '../../../lib/post-fetcher';
import patchFetcher from '../../../lib/patch-fetcher';
import putFetcher from '../../../lib/put-fetcher';
import deleteFetcher from '../../../lib/delete-fetcher';
import { useEffect, useState } from 'react';
import AmazonS3URI from 'amazon-s3-uri';
import { categories } from '../../../lib/helper';
import { ListingStatus } from '../../../lib/constant';

type Props = {
  alertRef: any;
};

let btn: any;

export default function ListView({ alertRef }: Props) {
  const router = useRouter();
  const { id } = router.query;
  const url = '/dashboard/postings';
  const title = id === 'new' ? 'New Posting' : 'Edit Posting';
  let isPublishedClicked = false;

  const fetchUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/product/${id}`;
  const { error, data } = useSWR(fetchUrl, fetcher);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [proActive, setProActive] = useState(false);
  const [commission, setCommission] = useState('');
  const [haveCategory, setHaveCategories] = useState<any>({});
  const [wantCategory, setWantCategories] = useState<any>({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [haveLongDesc, setLongDesc] = useState('');
  const [wantDesc, setWantDesc] = useState('');
  const [files, setFiles] = useState<any>([]);
  const [checkbox, setCheckbox] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  const [validated, setValidated] = useState(false);

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
    if (data && 'product' in data) {
      setName(data.product.name);
      if (data.product.price) {
        setPrice(data.product.price);
      }
      if (data.product.commission) {
        setCommission(data.product.commission);
      }
      setProActive(data.product.proActive);
      const haveCategories: any = {};
      for (let cat of data.product.haveCategory) {
        const nameArr = categories.filter((item) => item.value === cat);
        haveCategories[nameArr[0].name] = true;
      }
      setHaveCategories(haveCategories);
      const wantCategories: any = {};
      for (let cat of data.product.wantCategory) {
        const nameArr = categories.filter((item) => item.value === cat);
        wantCategories[nameArr[0].name] = true;
      }
      setWantCategories(wantCategories);
      if (data.product.phone) {
        setPhoneNumber(data.product.phone);
      }
      setLongDesc(data.product.haveLongDesc);
      setWantDesc(data.product.wantDetails);
      setFiles(data.product.images);
    }
  }, [data]);

  const generateData = () => {
    const haveCategoryData = [];
    for (let cat of Object.keys(haveCategory)) {
      const nameArr = categories.filter((item) => item.name === cat);
      haveCategoryData.push(nameArr[0].value);
    }
    const wantCategoryData = [];
    for (let cat of Object.keys(wantCategory)) {
      const nameArr = categories.filter((item) => item.name === cat);
      wantCategoryData.push(nameArr[0].value);
    }
    const data: any = {
      name: name,
      price: price && price.length > 0 ? price : 0,
      proActive: proActive,
      commission: commission === '' ? '0' : commission,
      haveCategory: haveCategoryData,
      wantCategory: wantCategoryData,
      phone: phoneNumber,
      haveLongDesc: haveLongDesc,
      wantDetails: wantDesc,
      images: files
    };
    if (isPublishedClicked) {
      data.status = ListingStatus.active;
      isPublishedClicked = false;
    }
    return data;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    setValidated(true);
    if (form.checkValidity() === false) {
      return;
    }

    const postData: any = generateData();
    postData.createdBy = sessionStorage.getItem('_id');
    const token = sessionStorage.getItem('token');
    let fetchUrl = process.env.NEXT_PUBLIC_SERVER_URL + '/product';
    let res;
    if (id === 'new') {
      res = await postFetcher(
        fetchUrl,
        postData,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        },
        alertRef
      );
    } else {
      fetchUrl = `${fetchUrl}/${id}`;
      res = await patchFetcher(
        fetchUrl,
        postData,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        },
        alertRef
      );
    }
    if (res) router.push(`/dashboard/postings`);
    else setProgress(null);
  };

  const onImageChange = async (event: any) => {
    if (
      event &&
      event.target &&
      event.target.files &&
      event.target.files.length > 0
    ) {
      for (const file of event.target.files) {
        const mimeType = file['type'];
        if (mimeType.split('/')[0] === 'image') {
          const token = sessionStorage.getItem('token');
          const fetchUrl = `${
            process.env.NEXT_PUBLIC_SERVER_URL
          }/product/upload?type=${mimeType.replace('/', '-')}`;
          const { key, url } = await fetcher(
            fetchUrl,
            {
              headers: {
                Authorization: 'Bearer ' + token
              }
            },
            alertRef
          ).catch((err: any) => console.log(err));
          try {
            await putFetcher(
              url,
              file,
              {
                headers: {
                  'Content-Type': mimeType
                },
                onUploadProgress: onUploadProgressFunc
              },
              alertRef
            );
          } catch (err) {
            alertRef?.current?.showAlert('danger', err || err.message);
          }
          setFiles([
            ...files,
            {
              name: file.name,
              url: `${process.env.NEXT_PUBLIC_S3_SERVER_URL}${key}`
            }
          ]);
        }
      }
    }
  };

  const removeFile = async (index: number) => {
    const newFiles = [...files];
    const { key } = AmazonS3URI(newFiles[index].url);
    const token = sessionStorage.getItem('token');
    const deleteFileUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/product/upload?key=${key}`;
    deleteFetcher(deleteFileUrl, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleRadioButtonChange = (e: any) => {
    if (e.target.id === 'pro-active-no') {
      setProActive(false);
    } else if (e.target.id === 'pro-active-yes') {
      setProActive(true);
    }
  };

  const onUploadProgressFunc = (progressEvent: any) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    if (percentCompleted === 100) {
      setTimeout(() => {
        setProgress(null);
      }, 2000);
    }
    setProgress(percentCompleted);
  };

  const publish = async () => {
    isPublishedClicked = true;
    btn.click();
  };

  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />

      <div className="account-section">
        <Container>
          <div className="d-flex justify-content-between heading mb-4">
            <span>Account</span>
            {id !== 'new' ? (
              <span>
                <Button
                  variant="secondary"
                  onClick={() => router.push('/dashboard/postings/new')}
                >
                  Add New Posting
                </Button>
              </span>
            ) : (
              <></>
            )}
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

                      <Link href="/dashboard/postings">
                        <div className="view-listing-text ml-2">
                          View All Postings
                        </div>
                      </Link>
                    </div>
                    <div className="publish-btn">
                      {/* <Button
                        variant="secondary"
                        onClick={() => alert('publish')}
                      >
                        Publish
                      </Button> */}
                    </div>
                  </div>

                  <div className="view-list-section">
                    <div className="view-section-heading">Add New Posting</div>
                    <Form
                      noValidate
                      validated={validated}
                      onSubmit={handleSubmit}
                    >
                      <div className="form-info mt-4">
                        <div className="form-info-heading">Posting Details</div>
                        <Row>
                          <Col>
                            <Form.Group controlId="listingDetailsName">
                              <Form.Label>Posting Name*</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Enter Name Here"
                                onChange={(e: any) => setName(e.target.value)}
                                value={name}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide a valid name.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} md={6}>
                            <Form.Group controlId="listingDetailsPrice">
                              <Form.Label>Posting Price</Form.Label>
                              <InputGroup hasValidation>
                                <InputGroup.Prepend>
                                  <InputGroup.Text id="inputGroupPrepend">
                                    $
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Price Here"
                                  onChange={(e: any) =>
                                    setPrice(e.target.value)
                                  }
                                  value={price}
                                  pattern="^[0-9]*$|Unpriced"
                                />
                                <Form.Control.Feedback type="invalid">
                                  Please provide a valid price.
                                </Form.Control.Feedback>
                              </InputGroup>
                              <Form.Check
                                inline
                                label="unpriced"
                                name="unpriced"
                                type="checkbox"
                                id="unpriced"
                                onChange={(e: any) => {
                                  e.target.checked
                                    ? setPrice('Unpriced')
                                    : setPrice('');
                                }}
                                checked={price === 'Unpriced'}
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group controlId="listingDetailsPrice">
                              <Form.Label>Pro Active</Form.Label>
                              <div className="align-middle">
                                <Form.Check
                                  inline
                                  label="Yes"
                                  name="pro-active"
                                  type="radio"
                                  id="pro-active-yes"
                                  onChange={handleRadioButtonChange}
                                  checked={proActive ? true : false}
                                />
                                <Form.Check
                                  inline
                                  label="No"
                                  name="pro-active"
                                  type="radio"
                                  id="pro-active-no"
                                  onChange={handleRadioButtonChange}
                                  checked={proActive ? false : true}
                                />
                              </div>
                              <Form.Text muted>
                                *Pro-Active ads are premium postings that help
                                you sell faster. This service is currently free
                                and in beta.
                              </Form.Text>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} md={6}>
                            <Form.Group controlId="listingDetailsCommission">
                              <Form.Label>Commission</Form.Label>
                              <InputGroup>
                                <InputGroup.Prepend>
                                  <InputGroup.Text id="inputGroupPrepend">
                                    %
                                  </InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                  type="text"
                                  placeholder="Enter Commission Here"
                                  onChange={(e: any) =>
                                    setCommission(e.target.value)
                                  }
                                  value={commission}
                                  pattern="^[0-9]*$"
                                />
                                <Form.Control.Feedback type="invalid">
                                  Please provide a valid commission.
                                </Form.Control.Feedback>
                              </InputGroup>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={12} md={6}>
                            <Form.Group controlId="listingDetailsHaveCategories">
                              <Form.Label>Haves Categories*</Form.Label>
                              {categories.map((item, index) => {
                                return (
                                  <Form.Check
                                    label={item.name}
                                    name={item.name}
                                    type="checkbox"
                                    id={`have-${index}`}
                                    value={item.value}
                                    key={index}
                                    onChange={(e: any) =>
                                      setHaveCategories({
                                        ...haveCategory,
                                        [e.target.name]: e.target.checked
                                      })
                                    }
                                    checked={haveCategory[item.name]}
                                  />
                                );
                              })}
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group controlId="listingDetailsWantCategories">
                              <Form.Label>Wants Categories*</Form.Label>
                              {categories.map((item, index) => {
                                return (
                                  <Form.Check
                                    label={item.name}
                                    name={item.name}
                                    type="checkbox"
                                    id={`want-${index}`}
                                    value={item.value}
                                    key={index}
                                    onChange={(e: any) =>
                                      setWantCategories({
                                        ...wantCategory,
                                        [e.target.name]: e.target.checked
                                      })
                                    }
                                    checked={wantCategory[item.name]}
                                  />
                                );
                              })}
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group controlId="listingDetailsPhone">
                              <Form.Label>Phone Number</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Your Phone Number"
                                className="textarea-formcontrol"
                                onChange={(e: any) =>
                                  setPhoneNumber(e.target.value)
                                }
                                value={phoneNumber}
                                pattern="^[0-9]*$|^\+[0-9]*$"
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide a valid phone number.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group controlId="listingDetailsLongDesc">
                              <Form.Label>Description*</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Enter Description"
                                className="textarea-formcontrol"
                                onChange={(e: any) =>
                                  setLongDesc(e.target.value)
                                }
                                value={haveLongDesc}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide a valid description.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group controlId="listingDetailsWantDetails">
                              <Form.Label>“Want” Details*</Form.Label>
                              <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Enter Want Details"
                                className="textarea-formcontrol"
                                onChange={(e: any) =>
                                  setWantDesc(e.target.value)
                                }
                                value={wantDesc}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                Please provide a valid description.
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                      <div className="form-info mt-4">
                        <div className="form-info-heading">Images</div>
                        <Row>
                          <Col xs={12} sm={12} md={6}>
                            <Form.Group controlId="listingDetailsImages">
                              <Form.Label>Upload a File</Form.Label>
                              <Form.File
                                id="custom-file-input"
                                label="Select an Image"
                                lang="en"
                                custom
                                accept="image/*"
                                feedback="Select atleast one file"
                                onChange={onImageChange}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        {progress && (
                          <Row className="my-2">
                            <Col xs={12} sm={12} md={6}>
                              <ProgressBar
                                striped
                                variant="success"
                                now={progress}
                                label={`${progress}%`}
                              />
                            </Col>
                          </Row>
                        )}

                        <Row
                          className={
                            files.length > 0 ? 'mt-2 image-list' : 'd-none'
                          }
                        >
                          <Col xs={12} sm={12} md={6}>
                            <div className="border-bottom pb-2">Image List</div>
                            <div>
                              {files.map((file: any, index: number) => {
                                return (
                                  <Row
                                    className="border-bottom py-2 mx-0"
                                    key={index}
                                  >
                                    <Col xs={9} className="px-0">
                                      {file.name}
                                    </Col>
                                    <Col
                                      xs={3}
                                      className="action-link text-right"
                                      onClick={() => removeFile(index)}
                                    >
                                      Remove
                                    </Col>
                                  </Row>
                                );
                              })}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Form.Group controlId="successFeeAgreementCheckbox">
                              <Form.Check>
                                <Form.Check.Input
                                  onChange={(e: any) =>
                                    setCheckbox(e.target.checked)
                                  }
                                  checked={checkbox}
                                  isValid={!!checkbox}
                                  required
                                />
                                <Form.Check.Label>
                                  {' '}
                                  By checking this box, you agree to our&nbsp;
                                  <span className="link-content">
                                    <a
                                      target="_blank"
                                      href="/success-fee-agreement"
                                      className="link"
                                    >
                                      Success Fee Agreement
                                    </a>
                                  </span>
                                </Form.Check.Label>
                                <Form.Control.Feedback type="invalid">
                                  Agreement must be accepted before submitting.
                                </Form.Control.Feedback>
                              </Form.Check>
                            </Form.Group>
                          </Col>
                        </Row>
                        <div className="buttons mt-2">
                          <Button
                            variant="secondary"
                            type="submit"
                            ref={(node: any) => (btn = node)}
                          >
                            Save as Draft
                          </Button>
                          <Button
                            variant="secondary"
                            type="button"
                            className="cancel-btn ml-3"
                            onClick={() => router.push(`/dashboard/postings`)}
                          >
                            Cancel
                          </Button>

                          <Button
                            variant="secondary"
                            className="ml-3"
                            onClick={() => publish()}
                          >
                            Publish
                          </Button>
                        </div>
                      </div>
                    </Form>
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
