import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="https://apimeme.com/static/img/logo.png" alt="Meme Generator Logo" className="logo-image" />
        <h1 className="title">Meme Generator</h1>
      </div>
    </header>
  );
};

export default Header;
