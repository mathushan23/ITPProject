import React from 'react';
import { useEffect , useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie'; 
import userprofile from '../../src/assets/images/userimge.png'



import axios from 'axios';

function DeleteUser() {
  const [user, setuser] = useState([]);
  const [usercount, setusercount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [dropdownVisible, setDropdownVisible] = useState(false);
  
    const navigate = useNavigate()
  
    const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
    const customername = userSession ? userSession.user.username : "Guest";
  

  useEffect(() => {
       axios.get("http://localhost:4000/api/workouts/deletuserdeatiles").then(
        (result) => {
           setuser(result.data);
           setSearchResults(result.data); 
        console.log(user)
     })
      .catch((error) => console.error("Error fetching data:", error));
    }, [usercount]);

  useEffect(() => {
    if (user) {
      setusercount(user.length);  
      console.log(user.length); 
    }
  }, [user]);  //

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
      const logoutconform = window.confirm("Are you sure you want to logout this account ?");
      if (logoutconform) {
        Cookies.remove("user");
        navigate('/'); 
    }
  }

  
return (<>
      
     
      <h1>Delete customers</h1>

       <nav style={{ backgroundColor: 'rgb(1, 31, 96)', padding: '10px', display: 'inline-block' }}>
          <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
              <li style={{ display: 'inline', marginRight: '20px' }}><Link  to="/admin/adminDashboard" style={{ textDecoration: 'none', color: 'rgb(0, 255, 255)' }}>Current customers</Link></li>
              <li style={{ display: 'inline' }}><Link to ="/admin/delet-user" style={{ textDecoration: 'none', color: 'rgb(0, 255, 255)' }}>Past customers</Link></li>
          </ul>
       </nav>



      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>

      <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
        <input
          type="text"
          placeholder="Search....."
          value={searchQuery}
          onChange={handleSearch} 
          style={{ width: '300px', padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
        />
      </div>

    </div>

  <h2>Total Customers Removed: {searchResults.length}</h2>

<table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px' }}>
  <thead style={{ backgroundColor: '#f4f4f4', color: '#333' }}>
    <tr>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Address</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Phone Number</th>
      
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Delete Reason</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Remove By</th>
      <th style={{ padding: '15px', border: '1px solid #ddd', textAlign: 'left' }}>Remove Date</th>
    </tr>
  </thead>
  <tbody>
    {searchResults.map((ob) => (
      <tr key={ob.email} style={{ backgroundColor: ob % 2 === 0 ? '#fafafa' : '#fff' }}>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.username}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.email}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.address}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.phone}</td>
        
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.reason}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.removeby}</td>
        <td style={{ padding: '12px', border: '1px solid #ddd' }}>{ob.date}</td>
      </tr>
    ))}
  </tbody>
</table>


    </>
  );
}

export default DeleteUser;
