import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  return (
    <>
      
      <div
        style={{
          backgroundImage: 'url(../../../image/p1.jpg)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          minHeight: '100vh', 
        }}
      >
  
        <nav
          className="navbar navbar-expand-lg"
          style={{
            backgroundColor: '#011F60',
            color: 'white',
          }}
        >
          <div className="container-fluid">
            
            <Link className="navbar-brand text-white" to="/shop">
              Arul Online Electromart
            </Link>

            
            <div className="collapse navbar-collapse justify-content-center">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/abc">
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/zcx">
                    Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/inventory">
                    Inventory
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/Arullogin">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

          
            <form className="d-flex me-3">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search Products"
                aria-label="Search"
              />
              <button className="btn btn-light" type="submit">
                Search
              </button>
            </form>

            
            <button className="btn btn-danger" aria-label="Logout">
              Logout
            </button>
          </div>
        </nav>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

      
        <Container>
          <h1 className="homepagewelcome">Welcome to the Order Management System</h1>
          <nav className="d-flex justify-content-center">
            <Link to="/client/Userhome">
              <button className="btn btn-primary mb-3">Customer Order</button>
            </Link>
            <Link to="/admin/dashboard">
              <button className="btn btn-secondary mb-3 ms-3">Admin Order</button>
            </Link>
            
            
          </nav>
          
        </Container>
        
      </div>
    </>
  );
};

export default HomePage;
