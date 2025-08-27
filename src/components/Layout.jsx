import React from 'react';
import NavLine from './NavLine';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <>
      <NavLine />
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

export default Layout; 