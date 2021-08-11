import { useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Profile from './../assets/svg/Profile.svg';
import ProfileGold from './../assets/svg/Profile-gold.svg';
import Image from 'next/image';

type Props = {
  url?: string;
  token?: string;
};

export default function Navigation({ url, token }: Props) {
  const [show, setShow] = useState(false);
  const [sessionToken, setSessionToken] = useState(token !== '' ? token : null);

  useEffect(() => {
    const t = sessionStorage.getItem('token');
    t && setSessionToken(t);
  });

  const [navDropdownTitle, setNavDropdownTitle] = useState(
    <span>
      <Profile height={24} width={24} />
    </span>
  );
  const showDropdown = () => {
    setShow(!show);
    setNavDropdownTitle(
      <span>
        <ProfileGold height={24} width={24} />
      </span>
    );
  };
  const hideDropdown = () => {
    setShow(false);
    setNavDropdownTitle(
      <span>
        <Profile height={24} width={24} />
      </span>
    );
  };

  const logout = () => {
    sessionStorage.clear();
  };

  return (
    <>
      <Navbar expand="md" sticky="top" className="navbar-dark">
        <Navbar.Brand href="/" className="align-middle">
          <Image src="/logo.png" alt="Logo" width={42} height={42} />
          <span className="ml-2 align-middle">Rexnet</span>
        </Navbar.Brand>
        <span className="ml-auto d-flex flex-md-row-reverse">
          <NavDropdown
            title={navDropdownTitle}
            id="collasible-nav-dropdown"
            show={show}
            onMouseEnter={showDropdown}
            onMouseLeave={hideDropdown}
          >
            {sessionToken ? (
              <>
                <NavDropdown.Item href="/dashboard">Dashboard</NavDropdown.Item>
                <NavDropdown.Item href="/" onClick={() => logout()}>
                  Logout
                </NavDropdown.Item>
              </>
            ) : (
              <>
                <NavDropdown.Item href="/login">Login</NavDropdown.Item>
                <NavDropdown.Item href="/signup">Sign Up</NavDropdown.Item>
              </>
            )}
          </NavDropdown>
          <Navbar.Toggle aria-controls="nav-collapse" />
          <Navbar.Collapse id="nav-collapse">
            <Nav className="ml-auto" activeKey={url}>
              <Nav.Link href="/postings">Postings</Nav.Link>
              <Nav.Link href="/token-maker">Token Maker</Nav.Link>
              <Nav.Link href="/token-exchange">Token Exchange</Nav.Link>
              <Nav.Link href="/market-maker">Market Maker</Nav.Link>
              <Nav.Link href="/about">About</Nav.Link>
              <Nav.Link href="/team">Team</Nav.Link>
              {/* <Nav.Link href="/support">Support</Nav.Link> */}
              <Nav.Link href="/contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </span>
      </Navbar>
    </>
  );
}
