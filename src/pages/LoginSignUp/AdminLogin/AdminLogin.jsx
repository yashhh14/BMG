import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        const API_URL = import.meta.env.VITE_API_URL;
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/api/admin/login`,
                {
                    email: email.trim(),
                    password
                },
                {
                    withCredentials: true
                }
            );

            console.log("Admin login:", response.data);
            navigate("/admin/dashboard");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Invalid admin credentials"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                <div className="admin-login-header">
                    <div className="admin-icon">👨‍💼</div>
                    <h1>Admin Login</h1>
                    <p>Login to manage BookMyJourney</p>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="admin-input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter admin email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="admin-input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && (
                        <p className="admin-login-error">{error}</p>
                    )}
                    <button
                        type="submit"
                        className="admin-login-btn"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login as Admin"}
                    </button>
                </form>
                <button
                    className="admin-back-btn"
                    onClick={() => navigate("/")}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;