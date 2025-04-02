import React from 'react';
//import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar1 = () => {
  

  return (
    <>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#011F60' }}>
        <div className="container-fluid">
          <Link className="navbar-brand text-white" to="/shop">Arul Online Electromart</Link>
          <div className="collapse navbar-collapse justify-content-center">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/ddd">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/abc">Products</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/inventory">Orders</Link>
              </li>
              
              <li className="nav-item">
                <Link className="nav-link text-white" to="/Arullogin">Login</Link>
              </li>
            </ul>
          </div>
          <form className="d-flex me-3">
            <input className="form-control me-2" type="search" placeholder="Search Products" aria-label="Search" />
            <button className="btn btn-light" type="submit">Search</button>
          </form>
          <button className="btn btn-danger" aria-label="Logout">Logout</button>
        </div>
      </nav>

      <br/>

     
    </>
  );
};

export default Navbar1;
