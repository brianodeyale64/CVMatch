import React from 'react';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="logo">
          <span className="logo-bracket">[</span>
          <span className="logo-text">CV</span>
          <span className="logo-accent">Match</span>
          <span className="logo-bracket">]</span>
        </div>
        <p className="tagline">AI-powered job application assistant</p>
      </div>
    </header>
  );
}

export default Header;
