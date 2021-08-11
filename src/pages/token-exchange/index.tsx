import Layout from '../../components/Layout';
import BasicMeta from '../../components/meta/BasicMeta';
import OpenGraphMeta from '../../components/meta/OpenGraphMeta';
import TwitterCardMeta from '../../components/meta/TwitterCardMeta';
import ComingSoon from '../../components/Coming-Soon';

export default function TokenExchange() {
  const url = '/token-exchange';
  const title = 'Token Exchange';
  return (
    <Layout url={url}>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />

      <ComingSoon></ComingSoon>
    </Layout>
  );
}
