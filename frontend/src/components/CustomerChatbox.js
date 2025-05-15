import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Chatbox = ({ selectedOrder, userRole }) => {
  const [newMessage, setNewMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  const baseURL = 'http://localhost:4000';

 // 1) In Chatbox, remove fetchOrders from the polling effect:
useEffect(() => {
  if (!selectedOrder) return;
  let cancelled = false;

  const fetchChat = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/orders/${selectedOrder._id}/chat`
      );
      if (!cancelled) setChatMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchChat();
  const iv = setInterval(fetchChat, 3000);
  return () => {
    cancelled = true;
    clearInterval(iv);
  };
}, [selectedOrder._id]);  // Only depend on the order ID, not the whole object or fetchOrders

  // 2) Scroll to bottom whenever chatMessages changes
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // 3) Focus input when opening
  useEffect(() => {
    if (inputRef.current && isOpen) inputRef.current.focus();
  }, [isOpen]);

  // 4) Focus edit input when editing
  useEffect(() => {
    if (editingMessageId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingMessageId]);

  // 5) Send a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedOrder) return;
    const payload = {
      message: newMessage,
      sender: userRole,
      timestamp: new Date().toISOString(),
      delivered: userRole === 'customer' ? false : true,
    };
    try {
      // POST and optimistic update
      const { data: sent } = await axios.post(
        `${baseURL}/api/orders/${selectedOrder._id}/chat`,
        payload
      );
      setChatMessages((prev) => [...prev, sent]);
      setNewMessage('');

      // AI for customer
      if (userRole === 'customer') {
        setTimeout(() => sendAIResponse(newMessage), 1500);
      }
    } catch (err) {
      console.error('Error sending:', err);
    }
  };

  // 6) AI auto-response
  const sendAIResponse = async (text) => {
    if (!selectedOrder) return;
    let reply = "Thanks—I'll get back to you shortly.";
    const lc = text.toLowerCase();
    if (lc.includes('order')) reply = 'What is your order number?';
    else if (lc.includes('refund'))
      reply = 'Refunds take 3–5 business days.';
    else if (lc.includes('hello') || lc.includes('hi'))
      reply = 'Hello! How can I help?';

    try {
      const { data: ai } = await axios.post(
        `${baseURL}/api/orders/${selectedOrder._id}/chat`,
        {
          message: reply,
          sender: 'admin',
          delivered: true,
          timestamp: new Date().toISOString(),
        }
      );
      setChatMessages((prev) => [...prev, ai]);
    } catch (err) {
      console.error('AI send error:', err);
    }
  };

  // 7) Mark read, edit, delete—all optimistically update local state too
  const handleRead = async (id) => {
    if (userRole !== 'admin') return;
    try {
      await axios.put(`${baseURL}/api/orders/${selectedOrder._id}/chat/${id}`, {
        read: true,
      });
      setChatMessages((prev) =>
        prev.map((m) => (m._id === id ? { ...m, read: true } : m))
      );
    } catch (err) {
      console.error('Read error:', err);
    }
  };
  const handleEdit = async (id) => {
    if (!editingText.trim()) return;
    try {
      const { data: res } = await axios.put(
        `${baseURL}/api/orders/${selectedOrder._id}/chat/${id}`,
        { message: editingText }
      );
      setChatMessages((prev) =>
        prev.map((m) => (m._id === id ? res.msg : m))
      );
      setEditingMessageId(null);
      setEditingText('');
    } catch (err) {
      console.error('Edit error:', err);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(
        `${baseURL}/api/orders/${selectedOrder._id}/chat/${id}`
      );
      setChatMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const getStatus = (m) => {
    if (m.sender === 'customer' && m.delivered) return '✔ Delivered';
    if (m.sender === 'admin' && m.read) return '✔✔ Read';
    return '';
  };

  if (!selectedOrder || !isOpen) return null;

  return (
    <div
      className="card position-fixed bottom-0 end-0 shadow-lg"
      style={{ width: 350, height: 450, margin: 16, zIndex: 1060 }}
    >
      <div className="card-header bg-primary text-white d-flex justify-content-between">
        <strong>
          {userRole === 'customer' ? '🛎️ Chat with Admin' : '👤 Chat with Customer'}
        </strong>
        <button className="btn btn-sm btn-light" onClick={() => setIsOpen(false)}>
          ✕
        </button>
      </div>
      <div
        ref={chatBoxRef}
        className="card-body overflow-auto p-2"
        style={{ background: '#f5f7fa' }}
      >
        {chatMessages.length === 0 && (
          <p className="text-center text-muted mt-5">No messages yet.</p>
        )}
        {chatMessages.map((msg) => {
          const me = msg.sender === userRole;
          const avatar = msg.sender === 'admin' ? '🧑‍💼' : '👤';
          const label = me ? 'You' : msg.sender === 'admin' ? 'Admin' : 'Customer';
          return (
            <div
              key={msg._id}
              className={`d-flex mb-2 ${me ? 'justify-content-end' : 'justify-content-start'}`}
            >
              {!me && <div className="me-2 fs-4">{avatar}</div>}
              <div
                className={`rounded p-2 position-relative ${
                  me ? 'bg-primary text-white' : 'bg-light text-dark'
                }`}
                style={{ maxWidth: '70%' }}
                onClick={() => handleRead(msg._id)}
              >
                <div className="small mb-1">{label}</div>
                {editingMessageId === msg._id ? (
                  <>
                    <input
                      ref={editInputRef}
                      className="form-control form-control-sm mb-1"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className="d-flex justify-content-end">
                      <button
                        className="btn btn-sm btn-success me-1"
                        onClick={() => handleEdit(msg._id)}
                      >
                        ✔
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => setEditingMessageId(null)}
                      >
                        ✖
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>{msg.message}</div>
                    <div className="d-flex justify-content-between align-items-center mt-1">
                      <small className="text-muted">
                        {new Date(msg.timestamp).toLocaleString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                          month: 'short',
                          day: 'numeric',
                        })}
                      </small>
                      {me && (
                        <small className="text-white-50 ms-1">{getStatus(msg)}</small>
                      )}
                    </div>
                    {me && (
                      <div className="position-absolute top-0 end-0">
                        <button
                          className="btn btn-sm btn-outline-light me-1"
                          title="Edit"
                          onClick={() => {
                            setEditingMessageId(msg._id);
                            setEditingText(msg.message);
                          }}
                        >
                          ✏
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete"
                          onClick={() => handleDelete(msg._id)}
                        >
                          🗑
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
              {me && <div className="ms-2 fs-4">{avatar}</div>}
            </div>
          );
        })}
      </div>
      <div className="card-footer p-2 bg-white">
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button className="btn btn-primary" onClick={handleSendMessage}>
            Send 📩
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
