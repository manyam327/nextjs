import { Row, Col, Pagination } from 'react-bootstrap';

type Props = {
  data: any;
  onChange: any;
};

export default function Card({ data, onChange }: Props) {
  const { hasNextPage, hasPrevPage, nextPage, page, prevPage, totalPages } =
    data;
  return (
    <Row className="my-5">
      <Col>
        <Pagination>
          {hasPrevPage && (
            <Pagination.Prev onClick={() => onChange(prevPage)} />
          )}
          {prevPage && prevPage - 2 > 0 && <Pagination.Ellipsis />}

          {prevPage && prevPage - 1 > 0 && (
            <Pagination.Item onClick={() => onChange(prevPage - 1)}>
              {prevPage - 1}
            </Pagination.Item>
          )}
          {prevPage && (
            <Pagination.Item onClick={() => onChange(prevPage)}>
              {prevPage}
            </Pagination.Item>
          )}
          {page && <Pagination.Item active>{page}</Pagination.Item>}
          {nextPage && (
            <Pagination.Item onClick={() => onChange(nextPage)}>
              {nextPage}
            </Pagination.Item>
          )}
          {nextPage && nextPage + 1 <= totalPages && (
            <Pagination.Item onClick={() => onChange(nextPage + 1)}>
              {nextPage + 1}
            </Pagination.Item>
          )}

          {nextPage && nextPage + 2 < totalPages && <Pagination.Ellipsis />}
          {hasNextPage && (
            <Pagination.Next onClick={() => onChange(nextPage)} />
          )}
        </Pagination>
      </Col>
    </Row>
  );
}
