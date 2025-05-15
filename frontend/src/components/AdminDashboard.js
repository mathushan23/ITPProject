import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie'; 
import userprofile from '../../src/assets/images/userimge.png';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AdminDashboard() {
  const [user, setUser] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [reason, setReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const navigate = useNavigate();

  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
  const customername = userSession ? userSession.user.username : "Guest";

  useEffect(() => {
    axios.get("http://localhost:4000/api/workouts/studentdetails")
      .then((result) => { 
        setUser(result.data);
        setSearchResults(result.data); 
        console.log("Users : ", result.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [userCount]);

  useEffect(() => {
    if (user) {
      setUserCount(user.length);  
      console.log("Total User : ", userCount);
    }
  }, [user]);

  function deleteUser(email) {
    if (reason === "") return;

    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (confirmDelete) {
      axios.post("http://localhost:4000/api/workouts/deleteuser", { email, reason })
        .then((result) => {
          console.log("Response from server:", result);
        })
        .catch((err) => {
          console.error("Delete Error:", err);
        });
    }
  }

  function addAdmin(email) {
    const addAdminConfirmation = window.confirm("Are you sure you want to add this account as an admin?");
    if (addAdminConfirmation) {
      axios.post("http://localhost:4000/api/workouts/addAdmin", { email })
        .then((result) => {
          console.log("Response from server:", result);
        })
        .catch((err) => {
          console.error("Error:", err);
        });
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const query = e.target.value.toLowerCase();
  
    const filteredUsers = user.filter(user => 
      user.username.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query) || 
      user.address.toLowerCase().includes(query) ||
      user.phone.toLowerCase().includes(query)
    );
    setSearchResults(filteredUsers);
  };

  function logout(){
    const logoutconform = window.confirm("Are you sure you want to logout?");
    if (logoutconform) {
      Cookies.remove("user");
      navigate('/'); 
    }
  }

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Customer Details Report", 14, 15);

    const tableData = searchResults.map(user => [
      user.username,
      user.email,
      user.address,
      user.phone,
    ]);

    autoTable(doc, {
      head: [['Name', 'Email', 'Address', 'Phone Number']],
      body: tableData,
      startY: 25,
      theme: 'striped',
    });

    doc.save('customer_details_report.pdf');
  };

  return (
    <>
      <h1>Current customers</h1>

      <nav style={{ backgroundColor: 'rgb(1, 31, 96)', padding: '10px', display: 'inline-block' }}>
        <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
          <li style={{ display: 'inline', marginRight: '20px' }}><Link to="/admin/adminDashboard" style={{ textDecoration: 'none', color: 'rgb(0, 255, 255)' }}>Current customers</Link></li>
          <li style={{ display: 'inline' }}><Link to="/admin/delet-user" style={{ textDecoration: 'none', color: 'rgb(0, 255, 255)' }}>Past customers</Link></li>
        </ul>
      </nav>

      {/* Search bar */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <input
          type="text"
          placeholder="Search....."
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '300px', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
        {/* Download PDF Button next to search bar */}
        <button
          onClick={generatePDF}
          style={{
            padding: '10px 20px', backgroundColor: '#ff9800', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px'
          }}
        >
          Download PDF
        </button>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
        <thead style={{ backgroundColor: '#f4f4f4', color: '#333' }}>
          <tr>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Address</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Phone Number</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Reason</th>
            <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Add Admin</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((ob, index) => (
            <tr key={ob.email} style={{ backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff' }}>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.username}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.email}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.address}</td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.phone}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <form style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{ padding: '8px', fontSize: '14px', border: '1px solid #ddd', marginRight: '10px', width: '80%' }}
                  />
                  <button
                    style={{
                      backgroundColor: '#f44336', color: 'white', padding: '8px 12px', border: 'none', cursor: 'pointer', borderRadius: '4px'
                    }}
                    onClick={() => deleteUser(ob.email)}
                  >
                    Delete
                  </button>
                </form>
              </td>
              <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                <button
                  style={{
                    padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: 'background-color 0.3s'
                  }}
                  onClick={() => addAdmin(ob.email)} // Add admin function
                >
                  Add Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default AdminDashboard;
