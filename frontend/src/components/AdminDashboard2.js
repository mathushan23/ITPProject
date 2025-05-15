import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('http://localhost:4000/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleCreate = async () => {
        if (!title || !message) {
            alert('Title and message are required');
            return;
        }
        try {
            const newNotification = { title, message };
            await axios.post('http://localhost:4000/notifications', newNotification);
            setTitle('');
            setMessage('');
            fetchNotifications(); // Refresh the list
        } catch (error) {
            console.error('Error creating notification:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/notifications/${id}`);
            fetchNotifications(); // Refresh the list
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '20px' }}>Admin Panel</h2>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ padding: '10px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <input 
                    type="text" 
                    placeholder="Message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ padding: '10px', width: '250px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <button 
                    onClick={handleCreate} 
                    style={{
                        padding: '10px 20px', 
                        backgroundColor: 'blue', 
                        color: 'white', 
                        border: 'none', 
                        cursor: 'pointer', 
                        borderRadius: '5px', 
                        transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'darkblue'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'blue'}
                >
                    Add Notification
                </button>
            </div>
            
            <h3 style={{ textAlign: 'center', fontSize: '20px', marginBottom: '20px' }}>Existing Notifications</h3>
            <ul style={{ listStyleType: 'none', padding: '0' }}>
                {notifications.map(notif => (
                    <li key={notif._id} style={{ marginBottom: '15px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <strong>{notif.title}</strong>: {notif.message}
                        </div>
                        <button 
                            onClick={() => handleDelete(notif._id)} 
                            style={{
                                backgroundColor: 'red', 
                                color: 'white', 
                                border: 'none', 
                                cursor: 'pointer', 
                                padding: '5px 10px', 
                                borderRadius: '5px', 
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = 'darkred'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'red'}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminPanel;
