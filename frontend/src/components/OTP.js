import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loginbackground from '../../src/assets/images/loginlogo.png'; // Correct path - no need '../../src'
import logo from '../../src/assets/images/Logo.png';
import axios from 'axios';

function OTP() {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState(""); // Correct the name to setError

    function handleOTP(e) {
        e.preventDefault();
        
        if (!/^[0-9]{5}$/.test(otp)) { // Check if OTP is exactly 5 digits
            setError("OTP should be exactly 5 digits.");
            return;
        }

        axios.post("http://localhost:4000/api/workouts/otp", { otp })
            .then((result) => {
                if (result.data.message === "EmailAlreadyExists") {  
                    setError("Email already exists. Try another email.");
                } 
                else if (result.data.message === "Success") {
                    setError("Please wait...");
                    setTimeout(() => { navigate('/'); }, 3000);
                }
                else {
                    setError("Invalid OTP. Please try again.");
                }
            })
            .catch((err) => {
                console.error("OTP Verification Error: ", err);
                setError("OTP verification failed. Please try again.");
            });
    }

    return (
        <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px 30px' }}>
                <img src={logo} alt="Logo" style={{ width: '260px', height: '100px' }} />
                <Link to="/" style={{ display: 'inline-block', padding: '10px 20px', fontSize: '18px', backgroundColor: 'rgb(20, 190, 190)', color: 'white', textDecoration: 'none', borderRadius: '25px', textAlign: 'center' }}><b>Login</b></Link>
            </header>

            <div className="container" style={{ display: 'flex', flex: 1, height: '80vh' }}>
                <div className="left-side" style={{ flex: 1.5, background: `url(${loginbackground}) no-repeat center center/cover` }}></div>
                <div className="right-side" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '20px' }}>
                    <div style={{ maxWidth: '400px', width: '100%' }}>
                        <h3 style={{ marginBottom: '20px' }}>Enter OTP sent to your email</h3>
                        <form onSubmit={handleOTP}>
                            <div style={{ marginBottom: '15px' }}>
                                <input
                                    type="text"
                                    value={otp}
                                    name="otp"
                                    onChange={(e) => setOtp(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        borderRadius: '5px',
                                        border: '1px solid #ccc',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        fontSize: '16px',
                                    }}
                                    placeholder="Enter OTP"
                                    maxLength="5" // 5 digits
                                />
                            </div>
                            <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'rgb(20, 190, 190)', color: 'white', border: 'none', borderRadius: '25px', fontSize: '16px' }}>
                                Submit
                            </button>
                            {error && <p style={{ textAlign: "center", color: "red", marginTop: "10px" }}>{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OTP;
