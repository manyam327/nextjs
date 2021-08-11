import { useRouter } from 'next/router';
import { Button, Container, Row, Col } from 'react-bootstrap';

type Props = {
  count: number;
};

export default function Section6({ count }: Props) {
  const router = useRouter();

  const handleAddPosting = () => {
    const token = sessionStorage.getItem('token');
    if (token) {
      router.push('/dashboard/postings/new');
    } else {
      sessionStorage.setItem(
        'message',
        'Please login first to create new posting!'
      );
      router.push('/login');
    }
  };

  return (
    <>
      {/* Section 6 - Start */}
      <div className="home-section-6">
        <Container fluid="md">
          <Row>
            <Col>
              Rexnet Annual Posting Fee
              <br />
              $100 per Million of Value + 1% Success Fee
              <br />
              <Button variant="secondary" href="/postings">
                View Postings
              </Button>
              <Button
                variant="secondary"
                className="ml-4"
                onClick={() => handleAddPosting()}
              >
                Add Posting
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
      {/* Section 6 - End */}
    </>
  );
}
