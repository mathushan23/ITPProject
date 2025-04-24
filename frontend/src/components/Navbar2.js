import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar2 = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);  // Pass search query to the parent component
  };

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#011F60' }}>
      <div className="container-fluid">
        <a className="navbar-brand text-white" href="shop">Arul Online Electromart</a>
        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link text-white" href="/ddd">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/abc">Products</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/inventory">Orders</a>
            </li>
            
          </ul>
        </div>

        {/* Search Bar */}
        <form className="d-flex me-3" onSubmit={handleSearch}>
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search Products"
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-light" type="submit">Search</button>
        </form>

        <button className="btn btn-danger">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar2;
