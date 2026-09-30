import React from 'react';
import './Header.css';

function Header() {
  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <header className="masthead">
      <div className="masthead-meta">
        <span>No. 001</span>
        <span className="masthead-date">{today}</span>
        <span>The Application Desk</span>
      </div>
      <h1 className="masthead-title">
        CV<em>Match</em>
      </h1>
      <div className="masthead-sub">
        <span className="masthead-tagline">Your CV, marked up against the job.</span>
      </div>
    </header>
  );
}

export default Header;
