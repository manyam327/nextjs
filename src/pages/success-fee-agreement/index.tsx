import Layout from '../../components/Layout';
import BasicMeta from '../../components/meta/BasicMeta';
import OpenGraphMeta from '../../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../../components/meta/TwitterCardMeta';

import { Container, Row, Col } from 'react-bootstrap';

export default function SuccessFeeAgreement() {
  const url = '/success-fee-agreement';
  const title = 'Success Fee Agreement';

  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />

      <div className="success-fee-agreement">
        <Container fluid="md">
          <Row>
            <Col>
              <div className="heading mb-2">Rexnet Success Fee Agreement</div>
            </Col>
          </Row>
          <Row>
            <Col className="mt-4">
              <div className="desc mb-2">
                The purchase of any real estate or asset Posting on the Rexnet
                Posting Service automatically creates a mutually acceptable,
                legally binding and enforceable contract for a Success Fee.
              </div>
              <div className="desc mb-2">
                Upon the successful sale or exchange of the asset in a Posting,
                and in consideration for utilizing the Rexnet Posting Service,
                the Posting entity agrees to pay a{' '}
                <strong>Success Fee of one percent (1%)</strong> of the total
                transaction to <strong>Rexnet LLC</strong> at the close of
                escrow.
              </div>
              <div className="desc">
                The Advertiser hereby guarantees payment of the Success Fee or,
                upon failure of payment, agrees to pay all legal costs of
                collection.
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
}
