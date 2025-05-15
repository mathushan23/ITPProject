import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';  // Import js-cookie library

import loginbackground from '../../src/assets/images/login.jpeg'


import axios from 'axios';


function Login() {
    const [email, setemail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate()

    function handleLogin(e) {
        e.preventDefault();
        setError("");
    
        axios.post("http://localhost:4000/api/workouts/login", { email, password })
            .then((result) => {
                const { message, getuser, role } = result.data;
    
                setError("Please wait...");
    
                setTimeout(() => {
                    if (message === "Invalid user") {
                        setError("New email detected. Please sign up");
                    } 
                    else if (message === "Successfullogin") {
                        const expirationTime = new Date().getTime() + 24 * 60 * 60 * 1000; 
    
                        Cookies.set("user", JSON.stringify({ user: getuser, expirationTime }), { expires: 1 });
    
                        role === "customer" ? navigate("/client/product") : navigate("/admin/dashboard");
                    } 
                    
                    else if (message === "Invalidcredentials") {
                        setError("Incorrect email or password");
                    } 
                    
                }, 2000);
            })
            .catch((err) => {
                console.error("Login error:", err);
                setError("Server error. Please try again.");
            });
    }

   return (
        <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px 30px' }}>
                
            <nav> <ul style={{ display: 'flex', listStyle: 'none', margin: 0, padding: 0 }}></ul></nav>
            </header>

            <div className="container" style={{ display: 'flex', flex: 1, height: '80vh' }}>
                <div className="left-side" style={{ flex: 1.5, background: `url(${loginbackground})no-repeat center center/cover`  }}></div>
                <div className="right-side" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '20px' }}>
                    <form onSubmit={handleLogin}  method="POST" className="login-box" style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', width: '100%', maxWidth: '400px' }}>
                        <h1 style={{ textAlign: 'center', marginBottom: '25px' }}>Login</h1>
                        <b>Email</b>
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            name="email"
                            required
                            onChange={(e) => setemail(e.target.value)}
                            style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' , fontSize:'18px' }}
                        />
                        
                        <b>Password</b>
                        <input
                            type="password"
                            placeholder="Enter your Password"
                            name="password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px'  , fontSize:'18px'}}
                        />
                        
                        <Link to ="/forgot-password" style={{ display: 'block', textAlign: 'right', fontSize: '14px', marginTop: '5px', color: 'blue', textDecoration: 'none' }}> Forgot Password?</Link>
                        
                        <br />
                        <button
                            style={{ width: '100%', padding: '10px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                        >
                            Login
                        </button>
                        <p style={{ textAlign: 'center', marginTop: '10px' }}>

                            Don't have an account? 
                                <Link to ="/sign-up" style={{ color: 'blue', textDecoration: 'none' }}> Sign up</Link>

                        </p>

                        { error && <p style={{ textAlign: "center", color: "red" }}>{error}</p> }
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;
