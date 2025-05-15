/*import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const Navbar = () => {

  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#011F60' }}>
      <div className="container-fluid">
        <a className="navbar-brand text-white" href="shop">Arul Online Electromart</a>
        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/dashboard">Home</a>
            </li> 
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/order">Orders</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/Inventory">Inventory</a>
            </li>     
           <li className="nav-item"> 
              <a className="nav-link text-white" href="/adminDashboard">Users</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/admin/report">Report</a>
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

export default Navbar;*/


//import { useSelector } from 'react-redux';

import 'bootstrap/dist/css/bootstrap.min.css';

import Login from "./Login";

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

import Cookies from 'js-cookie'; 
import userprofile from '../../src/assets/images/userimge.png'

function UserDashboard() {
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const customername = userSession ? userSession.user.username : "Guest";

    function logout() {
        const logoutConfirm = window.confirm("Are you sure you want to logout?");
        if (logoutConfirm) {
            Cookies.remove("user");
            navigate('/'); 
        }
    }
 

  

  return (  
    <> 
                  <div style={{ textAlign: "center", backgroundColor: "#f5f5f5" }}>
                      <header style={{ backgroundColor: "#011f60", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
                          
                      <Link className="navbar-brand text-white" to="/client/shop">Arul Online Electromart</Link>

      
                          <nav>
                              <Link to="/admin/dashboard" className="nav-link-custom" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Home</b></Link>
                              <Link to="/admin/order" className="nav-link-custom" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Orders</b></Link>
                              <Link to="/admin/Inventory" className ="nav-link-custom"style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Inventory</b></Link>
                              <Link to="/admin/adminDashboard" className ="nav-link-custom"style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Users</b></Link>
                              <Link to="/admin/report" className ="nav-link-custom"style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Report</b></Link>
                              <Link to="/admin/adminFeedback" className ="nav-link-custom" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Feedback</b></Link>
                              <Link to="/admin/adminpanel" className ="nav-link-custom" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Notification</b></Link>

                              
                          </nav>
      
                          <div style={{ display: "flex", alignItems: "center", cursor: "pointer", position: "relative" }} onClick={() => setDropdownVisible(!dropdownVisible)}>
                              <img src={userprofile} alt="User" style={{ width: "60px", height: "60px", borderRadius: "50%", border: "3px solid aqua", marginRight: "10px" }} />
                              <h2><b>{customername}</b></h2>
                              <span style={{ fontSize: "24px", marginLeft: "10px", color:"aqua" }}>☰</span>
                              {dropdownVisible && (
                                  <div className="dropdown-menu-custom" style={{ position: "absolute", top: "50px", right: 0, backgroundColor: "white", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", width: "150px", borderRadius: "5px", textAlign: "left" }}>
                                      <Link to='/profile' style={{ display: "block", padding: "10px", textDecoration: "none", color: "black" }}>View Profile</Link>
                                      <a onClick={logout} style={{ display: "block", padding: "10px", textDecoration: "none", color: "black" }}>Logout</a>
                                  </div>
                              )}
                          </div>
                      </header>
      
                     
          
                  </div>
      <br/>

     
    </>
  )
};


export default UserDashboard;
