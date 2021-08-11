import React, { useState } from 'react';
import ArrowUp from './../assets/svg/Arrow-up.svg';
import { Button } from 'react-bootstrap';

const ScrollButton = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
      /* you can also use 'auto' behaviour
		in place of 'smooth' */
    });
  };

  if (process.browser) {
    // Client-side-only code
    window.addEventListener('scroll', toggleVisible);
  }

  return (
    <Button
      variant="outline-light"
      onClick={scrollToTop}
      style={{ display: visible ? 'inline' : 'none' }}
    >
      <ArrowUp width={17} height={10} />
    </Button>
  );
};

export default ScrollButton;
