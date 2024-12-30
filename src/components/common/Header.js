import React from 'react';
import './Header.css'; // Add styles if needed

const Header = () => {
  return (
    <header className="header">
      <h1 className="header-title">Admin Dashboard</h1>
      <div className="header-actions">
        <button className="header-action">Logout</button>
      </div>
    </header>
  );
};

export default Header;
