import React from 'react';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';


const Navbar = () => {
  const { tasksList, error } = useSelector((state) => state.tasks);

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
            <li className="nav-item">
              <a className="nav-link text-white" href="/usehyvy">Inventory</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/Arullogin">Login</a>
            </li>
          </ul>
        </div>
        <form className="d-flex me-3">
          <input className="form-control me-2" type="search" placeholder="Search Products" aria-label="Search" />
          <button className="btn btn-light" type="submit">Search</button>
        </form>
        <button className="btn btn-danger">Logout</button>
      </div>
      <p className="text-center text-white mt-2">Currently {tasksList.length} task(s) pending</p>
      {error && <h5 className="text-center text-warning">{error}</h5>}
    </nav>
  );
};

export default Navbar;