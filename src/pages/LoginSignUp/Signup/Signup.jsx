import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import HomeBg from "../../../assets/hero_background.png";
const API_URL = import.meta.env.VITE_API_URL;
const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        if (!/^[A-Za-z ]{3,30}$/.test(name.trim())) {
            setError(
                "Name must contain only letters and be 3-30 characters"
            );
            return;
        }
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address");
            return;
        }
        if (!/^[6-9]\d{9}$/.test(phone.trim())) {
            setError(
                "Enter a valid 10-digit Indian mobile number"
            );
            return;
        }
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setError(
                "Password must have 8+ characters, uppercase, lowercase, number and special character"
            );
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}api/signup`,
                {
                    name: name.trim(),
                    phone: phone.trim(),
                    email: email.trim(),
                    password
                },
                {
                    withCredentials: true
                }
            );
            console.log(response.data);
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to create account"
            );
        } finally {
            setLoading(false);
        }
    };
    const handleGoogleSignup = () => {
        window.location.href =
            `${API_URL}api/auth/google`;
    };
    return (
        <div
            className="auth-page"
            style={{
                backgroundImage: `url(${HomeBg})`
            }}
        >
            <div className="auth-overlay"></div>
            <div className="auth-card signup-card">
                { }
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>
                        Start your journey with BookMyJourney
                    </p>
                </div>
                <form onSubmit={handleSignup}>
                    { }
                    <div className="auth-form-grid">
                        { }
                        <div className="auth-input-group">
                            <label>
                                Full Name
                            </label>
                            <div className="auth-input-wrapper">
                                <span>👤</span>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setError("");
                                    }}
                                />
                            </div>
                        </div>
                        { }
                        <div className="auth-input-group">
                            <label>
                                Mobile Number
                            </label>
                            <div className="auth-input-wrapper">
                                <span>📱</span>
                                <input
                                    type="tel"
                                    placeholder="Enter mobile number"
                                    value={phone}
                                    maxLength="10"
                                    onChange={(e) => {
                                        setPhone(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        );
                                        setError("");
                                    }}
                                />
                            </div>
                        </div>
                        { }
                        <div className="auth-input-group">
                            <label>
                                Email Address
                            </label>
                            <div className="auth-input-wrapper">
                                <span>📧</span>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(
                                            e.target.value
                                        );
                                        setError("");
                                    }}
                                />
                            </div>
                        </div>
                        { }
                        <div className="auth-input-group">
                            <label>
                                Password
                            </label>
                            <div className="auth-input-wrapper">
                                <span>🔒</span>
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Create a password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(
                                            e.target.value
                                        );
                                        setError("");
                                    }}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                >
                                    {showPassword
                                        ? "🙈"
                                        : "👁️"}
                                </button>
                            </div>
                        </div>
                    </div>
                    { }
                    <div className="password-hint">
                        Password must contain:
                        <ul>
                            <li>
                                At least 8 characters
                            </li>
                            <li>
                                Uppercase and lowercase letters
                            </li>
                            <li>
                                At least one number
                            </li>
                            <li>
                                At least one special character
                            </li>
                        </ul>
                    </div>
                    { }
                    {error && (
                        <div className="auth-error">
                            ⚠️ {error}
                        </div>
                    )}
                    { }
                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="auth-spinner"></span>
                                Creating Account...
                            </>
                        ) : (
                            "Create Account"
                        )}
                    </button>
                    { }
                    <div className="auth-divider">
                        <span></span>
                        <p>OR</p>
                        <span></span>
                    </div>
                    { }
                    <button
                        type="button"
                        className="google-auth-btn"
                        onClick={handleGoogleSignup}
                    >
                        <span className="google-icon">
                            G
                        </span>
                        Continue with Google
                    </button>
                    { }
                    <div className="auth-switch">
                        <span>
                            Already have an account?
                        </span>
                        <Link to="/login">
                            Login
                        </Link>
                    </div>
                    <button
                        className="admin-back-btn"
                        onClick={() => navigate("/")}
                    >
                        ← Back to Home
                    </button>
                </form>
            </div>
        </div>
    );
};
export default Signup;