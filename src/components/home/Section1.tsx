import { useRouter } from 'next/router';
import { Button, Container } from 'react-bootstrap';

export default function Section1() {
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
      {/* Section 1 - Start */}
      <div className="home-section-1">
        <Container fluid="md">
          <h1 className="display-4">Rexnet</h1>
          <h1 className="display-4">The Real Estate Disrupter</h1>
          <p className="mt-3">
            Rexnet is an online exchange network of proactive real estate
            postings
            <br />
            wherein cryptocurrencies are used for all or part of transactions.
          </p>
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
        </Container>
      </div>
      {/* Section 1 - End */}
    </>
  );
}
