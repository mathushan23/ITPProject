import React from "react";
import { Link, useNavigate } from "react-router-dom";
import userprofile from '../assets/images/userimge.png';

import back5 from '../assets/images/back5.jpg'

import Cookies from 'js-cookie';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const userSession = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : {};

  const myemail = userSession.user.email;
  console.log("MyEmail : ", myemail);

  function deleteaccount(myemail) {
    const confirmDelete = window.confirm("Are you sure you want to delete Your Account ?");
    if (confirmDelete) {
      axios.post("http://localhost:3000/api/workouts/deleteaccount", { myemail })
        .then((result) => {
          console.log("Response from server:", result);
          if (result.data.message === "UserDeleted") {
            Cookies.remove("user");
            navigate('/');
          }
        })
        .catch((err) => {
          console.error("Delete Error:", err);
        });
    }
  }
 
  return (
   <>
  <style>
    {`
      @keyframes popup3D {
        0% {
          transform: perspective(1000px) rotateX(-20deg) scale(0.8);
          opacity: 0;
        }
        100% {
          transform: perspective(1000px) rotateX(0deg) scale(1);
          opacity: 1;
        }
      }

      .container-3d {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: linear-gradient(135deg, #011f60, #6a11cb);
        background-image: url(${back5});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        padding: 50px;
      }

      .card-3d {
        background: white;
        padding: 30px;
        border-radius: 20px;
        width: 400px;
        text-align: center;
        animation: popup3D 0.8s ease;
        transform-style: preserve-3d;
        box-shadow:
          0 4px 8px rgba(0, 0, 0, 0.2),
          0 8px 16px rgba(0, 0, 0, 0.2),
          0 16px 32px rgba(0, 0, 0, 0.15),
          inset 0 0 15px rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(6px);
      }

      .card-3d img {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 3px solid #ddd;
        margin-bottom: 15px;
      }

      .card-3d input {
        width: 100%;
        padding: 12px;
        margin-bottom: 14px;
        border: 1px solid #ccc;
        border-radius: 10px;
        font-size: 15px;
        box-shadow: 2px 2px 6px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
      }

      .card-3d input:focus {
        outline: none;
        border-color: #6a11cb;
        box-shadow:
          0 0 0 3px rgba(106, 17, 203, 0.2),
          2px 2px 10px rgba(106, 17, 203, 0.3);
      }

      .card-3d button {
        padding: 12px;
        margin-top: 10px;
        width: 100%;
        border: none;
        border-radius: 10px;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .edit-btn { background-color: #4b0082; color: white; }
      .delete-btn { background-color: #dc3545; color: white; }
      .password-btn { background-color: #20C997; color: white; }

      .card-3d button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      }
    `}
  </style>

  <header
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#011f60',
      padding: '10px 30px'
    }}
  >
    <Link
      to={userSession.user.role === 'admin' ? '/admin/dashboard' : '/client/Userhome'}
      style={{
        padding: '10px 20px',
        fontSize: '18px',
        backgroundColor: 'rgb(173, 31, 185)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '25px',
        fontWeight: 'bold'
      }}
    >
      Back
    </Link>
  </header>

  <div className="container-3d">
    <div className="card-3d">
      <img src={userprofile} alt="Profile" />
      <h2>{userSession.user.username}</h2>

      <input type="email" defaultValue={userSession.user.email} placeholder="Email" />
      <input type="text" defaultValue={userSession.user.phone} placeholder="Phone" />
      <input type="text" defaultValue={userSession.user.address} placeholder="Address" />
      <input type="text" value={userSession.user.role} disabled />

      <button className="edit-btn" onClick={() => navigate('/updateprofile')}><b>Edit Profile</b></button>
      <button className="delete-btn" onClick={() => deleteaccount(myemail)}><b>Delete Account</b></button>
    </div>
  </div>
</>


  
  );
};

export default Profile;
