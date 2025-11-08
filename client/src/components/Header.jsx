import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>🎵 PlayVibes</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Discover</Link>
            <Link to="/share" className="nav-link btn-primary">Share Playlist</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
