import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerPage.css';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false); // State to control notification visibility
    const navigate = useNavigate();

    // Fetch notifications
    useEffect(() => {
        fetch('http://localhost:4000/notifications')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch notifications');
                }
                return response.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setNotifications(data);
                } else {
                    throw new Error('Invalid data format');
                }
            })
            .catch((err) => {
                console.error('Error fetching notifications:', err);
                setError(err.message);
            });
    }, []);

    const handleNotificationClick = (notification) => {
        // Navigate to ProductPage and pass notification data as state
        navigate('/product', { state: { notification } });
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications); // Toggle notification dropdown visibility
    };

    if (error) {
        return <div style={{ color: 'red' }}>Error: {error}</div>;
    }

    return (
        <div className="container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <ul>
                    <button className='navBtn'><a href="/">Home</a></button>
                    <button className='navBtn'><a href="/products">Products</a></button>
                    <button className='navBtn'><a href="/contactus">Contact Us</a></button>
                    <button className='navBtn'><a href="/feedback">Feedback</a></button>
                    {/* Notification Button */}
                    <li className="notification-button" onClick={toggleNotifications}>
                        <button className="notification-btn">
                            Notifications 🔔<span className="notification-count">{notifications.length}</span>
                        </button>
                    </li>   
                    <button className='logout'><a href="/Login">LogOut</a></button>
                </ul>
            </nav>

            {/* Notifications Dropdown */}
            {showNotifications && (
                <div className="notifications-dropdown">
                    <h3>Notifications</h3>
                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map((notification) => (
                                <li
                                    key={notification.id}
                                    onClick={() => handleNotificationClick(notification)}
                                    className="notification-item"
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

            <div className="content">
                <h2>Welcome to ARUL ELECTRO MART</h2>
            </div>
        </div>
    );
};

export default NotificationPage;
