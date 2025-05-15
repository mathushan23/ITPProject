import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import loginbackground from '../../src/assets/images/login.jpeg';

function Forgotpassword() {
    const [email, setemail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [conformpassword, setconformpassword] = useState("");
    const [error, setError] = useState("");
    const [step, setStep] = useState("email"); // email → otp

    const navigate = useNavigate();

    const sendOtp = async () => {
        setError("");
        if (!email) {
            setError("Please enter your email");
            return;
        }

        try {
            const res = await axios.post("http://localhost:4000/api/auth/send-otp", { email });
            setError("OTP sent to your email");
            setStep("otp");
        } catch (err) {
            console.error("OTP Error:", err);
            setError("Failed to send OTP. Try again.");
        }
    };

    const handleForgotpassword = async (e) => {
        e.preventDefault();
        setError("");

        const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password || !strongPassword.test(password)) {
            setError("Password is not strong");
            return;
        }

        if (password !== conformpassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const res = await axios.post("http://localhost:4000/api/auth/verify-otp", {
                email,
                otp,
                password,
            });

            const { message } = res.data;

            if (message === "OTP verified. Password updated successfully") {
                setError("Password updated successfully");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(message || "Invalid OTP or user");
            }
        } catch (err) {
            console.error("Error:", err);
            setError("Server error. Try again.");
        }
    };

    return (
        <>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'black', padding: '10px 30px' }}>
                <Link to="/login" style={{ display: 'inline-block', padding: '10px 20px', fontSize: '18px', backgroundColor: 'rgb(20, 190, 190)', color: 'white', textDecoration: 'none', borderRadius: '25px', textAlign: 'center' }}>
                    <b>Login</b>
                </Link>
            </header>

            <div className="container" style={{ display: 'flex', flex: 1, height: '80vh' }}>
                <div className="left-side" style={{ flex: 1.5, background: `url(${loginbackground})no-repeat center center/cover` }}></div>
                <div className="right-side" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4', padding: '20px' }}>
                    <form onSubmit={handleForgotpassword} className="login-box" style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', width: '100%', maxWidth: '500px' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Reset Password with OTP</h2>

                        <b>Email</b>
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            name="email"
                            required
                            value={email}
                            onChange={(e) => setemail(e.target.value)}
                            style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                        />

                        {step === "email" && (
                            <button type="button" onClick={sendOtp} style={{ width: '100%', padding: '10px', backgroundColor: '#0a0', color: 'white', border: 'none', borderRadius: '5px', marginBottom: '10px' }}>
                                Send OTP
                            </button>
                        )}

                        {step === "otp" && (
                            <>
                                <b>OTP</b>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    name="otp"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                                />

                                <b>Password</b>
                                <input
                                    type="password"
                                    placeholder="Create your Password"
                                    name="password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                                />

                                <b>Confirm Password</b>
                                <input
                                    type="password"
                                    placeholder="Confirm your Password"
                                    name="conformpassword"
                                    required
                                    onChange={(e) => setconformpassword(e.target.value)}
                                    style={{ width: '100%', padding: '12px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
                                />

                                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                                    Reset Password
                                </button>

                                <p style={{ textAlign: "center" }}>Password must include an uppercase letter, lowercase letter, number, and special character. <b>Ex: A1@bcdef</b></p>
                            </>
                        )}

                        {error && <p style={{ textAlign: "center", color: "red" }}>{error}</p>}
                    </form>
                </div>
            </div>
        </>
    );
}

export default Forgotpassword;
