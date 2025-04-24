import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const Navbar = () => {

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#011F60' }}>
      <div className="container-fluid">
        <a className="navbar-brand text-white" href="shop">Arul Online Electromart</a>
        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link text-white" href="/DirectPurchase">Home</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/abc">Products</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/order">Orders</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/Inventory">Inventory</a>
            </li>
            
          </ul>
        </div>
        <form className="d-flex me-3">
        </form>
        <button className="btn btn-danger">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;