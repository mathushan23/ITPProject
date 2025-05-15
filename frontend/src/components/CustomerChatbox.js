import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbox = ({ selectedOrder, fetchOrders, userRole }) => {
  const [newMessage, setNewMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const chatBoxRef = useRef(null);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await axios.post(`/api/orders/${selectedOrder._id}/chat`, {
        message: newMessage,
        sender: userRole,
      });
      setNewMessage('');
      fetchOrders();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleCancelChat = () => setIsOpen(false);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [selectedOrder?.chat]);

  if (!selectedOrder || !selectedOrder.chat || !isOpen) return null;

  const getMessageStatusIcon = (msg) => {
    if (msg.read) return '✔✔';     // Seen
    if (msg.delivered) return '✔'; // Delivered
    return '';                      // Sent
  };

  return (
    <div
      className="card shadow-lg position-fixed bottom-0 end-0 m-4"
      style={{ width: '380px', height: '540px', zIndex: 1050 }}
    >
      <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
        <strong>
          {userRole === 'customer' ? '🛎️ Chat with Admin' : '👤 Chat with Customer'}
        </strong>
        <button className="btn btn-sm btn-outline-light" onClick={handleCancelChat}>
          ✕
        </button>
      </div>

      <div
        ref={chatBoxRef}
        className="card-body overflow-auto px-3"
        style={{ backgroundColor: '#f4f6f8' }}
      >
        {selectedOrder.chat.length > 0 ? (
          selectedOrder.chat.map((msg, idx) => {
            const isSelf = msg.sender === userRole;
            const avatar = msg.sender === 'admin' ? '👨‍💼' : '🧑‍💼';
            return (
              <div
                key={idx}
                className={`d-flex mb-3 ${isSelf ? 'justify-content-end' : 'justify-content-start'}`}
              >
                {!isSelf && (
                  <div className="me-2" style={{ fontSize: '1.5rem' }}>
                    {avatar}
                  </div>
                )}
                <div
                  className={`p-3 rounded shadow-sm ${isSelf ? 'bg-primary text-white' : 'bg-white text-dark'}`}
                  style={{ maxWidth: '70%' }}
                >
                  <div className="fw-semibold mb-1" style={{ fontSize: '0.9rem' }}>
                    {isSelf ? 'You' : msg.sender === 'admin' ? 'Admin' : 'Customer'}
                  </div>
                  <div style={{ fontSize: '1rem' }}>{msg.message}</div>
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <small className="text-muted">{new Date(msg.timestamp || msg.createdAt).toLocaleString()}</small>
                    {isSelf && (
                      <small className="ms-2">
                        {getMessageStatusIcon(msg)}
                      </small>
                    )}
                  </div>
                </div>
                {isSelf && (
                  <div className="ms-2" style={{ fontSize: '1.5rem' }}>
                    {avatar}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-muted text-center mt-5">No messages yet.</p>
        )}
      </div>

      <div className="card-footer bg-light border-top">
        <div className="input-group">
          <input
            type="text"
            className="form-control border-0 shadow-sm"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="btn btn-primary" onClick={handleSendMessage}>
            📩
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
