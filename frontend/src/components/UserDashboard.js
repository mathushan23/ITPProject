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
                    

                    <nav>
                        <Link to="/client/Userhome" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Home</b></Link>
                        <Link to="/client/product" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Products</b></Link>
                        <Link to="/client/addCart" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Order</b></Link>
                        <Link to="/profile" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b>Login</b></Link>
                        <Link to="" style={{ padding: '10px 20px', fontSize: '18px', color: 'white', textDecoration: 'none', textAlign: 'center' }}><b></b></Link>
                        
                    </nav>

                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer", position: "relative" }} onClick={() => setDropdownVisible(!dropdownVisible)}>
                        <img src={userprofile} alt="User" style={{ width: "60px", height: "60px", borderRadius: "50%", border: "3px solid aqua", marginRight: "10px" }} />
                        <h2><b>{customername}</b></h2>
                        <span style={{ fontSize: "24px", marginLeft: "10px", color:"aqua" }}>☰</span>
                        {dropdownVisible && (
                            <div style={{ position: "absolute", top: "50px", right: 0, backgroundColor: "white", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)", width: "150px", borderRadius: "5px", textAlign: "left" }}>
                                <Link to='/profile' style={{ display: "block", padding: "10px", textDecoration: "none", color: "black" }}>View Profile</Link>
                                <a onClick={logout} style={{ display: "block", padding: "10px", textDecoration: "none", color: "black" }}>Logout</a>
                            </div>
                        )}
                    </div>
                </header>

               
                <h1>Welcome Customer! {customername}</h1>  
    
            </div>
        </>
    );
}

export default UserDashboard;
