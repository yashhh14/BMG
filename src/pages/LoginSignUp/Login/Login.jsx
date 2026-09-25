import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoginSignupLoader from "../../../components/PageLoader/PageLoader";
import "./Login.css";
import { useAuth } from "../../../context/AuthContext";
import HomeBg from "../../../assets/hero_background.png";

const Login = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!/^[6-9]\d{9}$/.test(phone.trim())) {
            setError("Enter a valid 10-digit Indian mobile number");
            return;
        }

        if (!password) {
            setError("Please enter your password");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${API_URL}/api/login`,
                {
                    phone: phone.trim(),
                    password
                },
                {
                    withCredentials: true
                }
            );

            setUser(response.data.user);

            await new Promise(
                resolve => setTimeout(resolve, 2000)
            );

            navigate("/");
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Invalid phone number or password"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href =
            `${API_URL}/api/auth/google`;
    };

    return (
        <div
            className="auth-page"
            style={{
                backgroundImage: `url(${HomeBg})`
            }}
        >
            {loading && <LoginSignupLoader type="login" />}

            <div className="auth-overlay"></div>

            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Login to continue your journey</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="auth-input-group">
                        <label>Mobile Number</label>
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

                    <div className="auth-input-group">
                        <label>Password</label>
                        <div className="auth-input-wrapper">
                            <span>🔒</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError("");
                                }}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="auth-error">
                            ⚠️ {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="auth-spinner"></span>
                                Logging in...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <div className="auth-divider">
                        <span></span>
                        <p>OR</p>
                        <span></span>
                    </div>

                    <button
                        type="button"
                        className="google-auth-btn"
                        onClick={handleGoogleLogin}
                    >
                        <span className="google-icon">G</span>
                        Continue with Google
                    </button>

                    <div className="auth-switch">
                        <span>Don't have an account?</span>
                        <Link to="/signup">Create Account</Link>
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

export default Login;