import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import 'bootstrap/dist/css/bootstrap.min.css';
import userprofile from '../../src/assets/images/userimge.png';

function UserDashboard() {
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);

    const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const customername = userSession ? userSession.user.username : "Guest";

    useEffect(() => {
        fetch('http://localhost:4000/notifications')
            .then((response) => {
                if (!response.ok) throw new Error('Failed to fetch notifications');
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) setNotifications(data);
                else throw new Error('Invalid data format');
            })
            .catch((err) => {
                console.error('Error fetching notifications:', err);
                setError(err.message);
            });
    }, []);

    const logout = () => {
        const logoutConfirm = window.confirm("Are you sure you want to logout?");
        if (logoutConfirm) {
            Cookies.remove("user");
            navigate('/');
        }
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const handleNotificationClick = (notification) => {
        navigate('/client/product', { state: { notification } });
    };

    return (
        <>
            <div style={{ textAlign: "center", backgroundColor: "#f5f5f5" }}>
                <header style={{ backgroundColor: "#011f60", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px" }}>
                    <Link className="navbar-brand text-white" to="/client/shop">Arul Online Electromart</Link>

                    <nav>
                        <Link to="/client/product" className="nav-link-custom" style={navLinkStyle}><b>Home</b></Link>
                        <Link to="/client/Userhome" className="nav-link-custom" style={navLinkStyle}><b>Order</b></Link>
                        <Link to="/client/addCart" className="nav-link-custom" style={navLinkStyle}><b>Cart</b></Link>
                        <Link to="/client/feedback" className="nav-link-custom" style={navLinkStyle}><b>Feedback</b></Link>
                        <Link to="/profile" className="nav-link-custom" style={navLinkStyle}><b>Login</b></Link>
                    </nav>

                    <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
                        {/* Notification Bell */}
                        <div onClick={toggleNotifications} style={{ cursor: "pointer", position: "relative" }}>
                            <span style={{ fontSize: "24px", color: "aqua" }}>Notification🔔</span>
                            {notifications.length > 0 && (
                                <span style={notificationCountStyle}>{notifications.length}</span>
                            )}
                        </div>

                        {/* User Profile */}
                        <div onClick={() => setDropdownVisible(!dropdownVisible)} style={{ display: "flex", alignItems: "center", cursor: "pointer" }} className="user-dropdown-trigger">
                            <img src={userprofile} alt="User" style={profileImageStyle} />
                            <h2><b>{customername}</b></h2>
                            <span style={{ fontSize: "24px", marginLeft: "10px", color: "aqua" }}>☰</span>
                        </div>

                        {/* Notification Dropdown */}
                        {showNotifications && (
    <div style={notificationDropdownStyle}>
        <h5>Notifications</h5>
        {notifications.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                {notifications.map((notification) => (
                    <li
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        style={notificationItemStyle}
                    >
                        {notification.message}
                    </li>
                ))}
            </ul>
        ) : (
            <p>No notifications available.</p>
        )}
    </div>
)}

                        {/* Profile Dropdown */}
                        {dropdownVisible && (
                            <div className="dropdown-menu-custom" style={profileDropdownStyle}>
                                <Link to='/profile' style={dropdownItemStyle}>View Profile</Link>
                                <button onClick={logout} style={dropdownButtonStyle}>Logout</button>
                            </div>
                        )}
                    </div>
                </header>
            </div>
            <br />
        </>
    );
}

export default UserDashboard;

// ---------- Styles ----------
const navLinkStyle = {
    padding: '10px 20px',
    fontSize: '18px',
    color: 'white',
    textDecoration: 'none',
    textAlign: 'center'
};

const profileImageStyle = {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "3px solid aqua",
    marginRight: "10px"
};

const notificationCountStyle = {
    position: "absolute",
    top: "-5px",
    right: "-10px",
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    padding: "2px 6px",
    fontSize: "12px"
};

const notificationDropdownStyle = {
    position: "absolute",
    top: "70px",
    right: "100px",
    backgroundColor: "white",
    color: "black",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    width: "250px",
    borderRadius: "5px",
    padding: "10px",
    zIndex: 9999 // <- make sure this is high enough
};

const notificationItemStyle = {
    padding: "8px",
    borderBottom: "1px solid #ddd",
    cursor: "pointer",
    color: "black",  // Change text color
    transition: "color 0.3s ease"
};

const profileDropdownStyle = {
    position: "absolute",
    top: "70px",
    right: 0,
    backgroundColor: "white",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    width: "150px",
    borderRadius: "5px",
    textAlign: "left"
};

const dropdownItemStyle = {
    display: "block",
    padding: "10px",
    textDecoration: "none",
    color: "black"
};

const dropdownButtonStyle = {
    background: "none",
    border: "none",
    padding: "10px",
    width: "100%",
    textAlign: "left",
    color: "black",
    cursor: "pointer"
};
