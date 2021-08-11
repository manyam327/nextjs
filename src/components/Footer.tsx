import { Nav } from 'react-bootstrap';
import ScrollButton from './Scroll-Up';

type Props = {
  url?: string;
};

export default function Footer({ url }: Props) {
  return (
    <>
      <Nav className="justify-content-center" activeKey={url}>
        <Nav.Link href="/postings">Postings</Nav.Link>
        <Nav.Link href="/token-maker">Token Maker</Nav.Link>
        <Nav.Link href="/token-exchange">Token Exchange</Nav.Link>
        <Nav.Link href="/market-maker">Market Maker</Nav.Link>
        <Nav.Link href="/about">About</Nav.Link>
        <Nav.Link href="/team">Team</Nav.Link>
        {/* <Nav.Link href="/support">Support</Nav.Link> */}
        <Nav.Link href="/contact">Contact</Nav.Link>
      </Nav>
      <div className="flex-container">
        <div className="spacer-div"></div>
        <div className="copy-right">
          Copyright ©{new Date().getFullYear()} Rexnet LLC. All rights reserved.
        </div>
        <div className="up-btn">
          <ScrollButton />
        </div>
      </div>
    </>
  );
}
