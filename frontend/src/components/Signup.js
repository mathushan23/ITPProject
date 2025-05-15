import React, { useState } from "react";
import { Link , useNavigate } from "react-router-dom";

import loginbackground from '../../src/assets/images/login.jpeg'


import axios from 'axios';


function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [conpassword, setconPassword] = useState("");
    const [email, setEmail] = useState("");
    const [address , setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    
    const navigate = useNavigate()

    function handleSignup(e) {
        e.preventDefault(); 
        setError("");

        if (!username || username.length < 3) {
            setError("Username must be at least 3 characters long");
            return;
        }

        const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password || !strongPassword.test(password)) {
            setError("Password is not strong");
            return;
        }

        const realPhone = /^(?:\+94|0)(7[01245678]\d{7})$/;
        if (phone.startsWith("+94")) {
           if (phone.length !== 12 || !realPhone.test(phone)) {
                setError("Invalid phone number");
                return;
            }}
        else if (phone.length !== 10 || !realPhone.test(phone)) {
                setError("Invalid phone number");
                return;
             }

             if(conpassword != password){
                setError("Password not match");
                return;

             }


    axios.post("http://localhost:4000/api/workouts/register", { username, email, password, phone, address })
        .then((result) => {
            if (result.data.message === "EmailAlreadyExists") {  
                setError("Email already exists. Try another email");
            } 
            else if (result.data.message === "UserCreated") {
                setError("Please wait......");
                setTimeout(() => { navigate('/login') }, 3000);
            }
        })
        .catch((err) => {
            console.error("Signup Error: ", err);
            setError("Signup failed. Please try again.");
        });
};

        
          return (
            <>
            <style>
                {`
                .container {
                    display: flex;
                    justify-content: center;
                    align-items: stretch;
                    height: 100vh;
                    padding: 0;
                }
        
                .left-side {
                    flex: 1;
                    background-image: url(${loginbackground}); /* replace this URL with your image */
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                }
        
                .right-side {
                    flex: 1;
                    max-width: 600px;
                    padding: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
        
                .login-box {
                    width: 100%;
                    border-radius: 15px;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                    background-color: #fff;
                    padding: 30px;
                }
        
                .login-box input {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border-radius: 10px;
                    border: 1px solid #ccc;
                }
        
                .login-box button {
                    width: 100%;
                    padding: 10px;
                    background-color: black;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                }
        
                .login-box button:hover {
                    background-color: #333;
                }
        
                .password-note {
                    font-size: 12px;
                    color: gray;
                }
        
                .error-message {
                    color: red;
                }
        
                @media (max-width: 768px) {
                    .container {
                        flex-direction: column;
                    }
        
                    .left-side {
                        display: none;
                    }
        
                    .right-side {
                        width: 100%;
                    }
                }
                `}
            </style>
        
            <header className="header" style={{ padding: "10px 20px", textAlign: "right" }}>
                <Link to="/login" className="login-button" style={{ textDecoration: "none", color: "black", fontWeight: "bold" }}>
                    Login
                </Link>
            </header>
        
            <div className="container">
                <div className="left-side"></div>
                
        
                <div className="right-side">
                    <form onSubmit={handleSignup} className="login-box">
                        <h2>Create Account</h2>
        
                        <b>Name</b>
                        <input
                            type="text"
                            placeholder="Enter your Username"
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
        
                        <b>Email</b>
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value.trim())}
                            required
                        />
        
                        <b>Address</b>
                        <input
                            type="text"
                            placeholder="Enter your Address"
                            value={address}
                            name="address"
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
        
                        <b>Phone number</b>
                        <input
                            type="tel"
                            placeholder="Enter your Phone number"
                            name="phone"
                            onChange={(e) => setPhone(e.target.value.trim())}
                            required
                        />
        
                        <b>Password</b>
                        <input
                            type="password"
                            placeholder="Create your Password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value.trim())}
                            required
                        />
        
                        <b>Confirm Password</b>
                        <input
                            type="password"
                            placeholder="Confirm your Password"
                            name="password"
                            onChange={(e) => setconPassword(e.target.value.trim())}
                            required
                        />
        
                        <button type="submit">Submit</button>
        
                        <p className="password-note">
                            The password must be at least 8 characters with one uppercase, lowercase, number, and special character <b>Example: A1@bcdef</b>
                        </p>
        
                        {error && <p className="error-message">{error}</p>}
                    </form>
                </div>
            </div>
        </>
        


        
        
    );
}

export default Signup;
