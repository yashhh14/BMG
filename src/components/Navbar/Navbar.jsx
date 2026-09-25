import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import Logo from "../../assets/logo.png";
import LogoutIcon from "../../assets/logout.png";
import PageLoader from "../PageLoader/PageLoader";

const Navbar = () => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const { user, loading, logout } = useAuth();
    const closeMenu = () => {
        setMenuOpen(false);
    };
    const handleLogout = async () => {
        try {
            setLogoutLoading(true);
            setMenuOpen(false);
            await logout();
            await new Promise(resolve => setTimeout(resolve, 2000));
            setLogoutLoading(false);
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
            setLogoutLoading(false);
        }
    };
    const navClass = ({ isActive }) =>
        isActive ? "tab-btn active" : "tab-btn";
    const mobileClass = ({ isActive }) =>
        isActive ? "active" : "";
    return (
        <>
            {logoutLoading && <PageLoader type="logout" />}
            <nav className="navbar-1">
                <NavLink to="/" className="navbar-1-1" onClick={closeMenu} >
                    <img src={Logo} alt="BookMyJourney" />
                </NavLink>
                <div className="navbar-1-2">
                    <div className="bodyNav">
                        <NavLink to="/" className={navClass} > Home
                        </NavLink>
                        <NavLink to="/my-bookings" className={navClass} > 🎫 My Bookings
                        </NavLink>
                        <NavLink to="/settings" className={navClass} > ⚙️ Settings
                        </NavLink>
                        <NavLink to="/support" className={navClass} > ❓ Help & Support
                        </NavLink>
                        {user && (
                            <button onClick={handleLogout} className="tab-btn logout-btn" >
                                <img src={LogoutIcon} alt="Logout" />
                                <span>Logout</span>
                            </button>
                        )}
                    </div>
                </div>
                {loading ? (
                    <div className="auth-loading">
                        Loading...
                    </div>
                ) : user ? (
                    <div className="user-info">
                        <span className="user-avatar">👤</span>
                        <span className="user-name">
                            {user.name}
                        </span>
                    </div>
                ) : (
                    <NavLink to="/login" className="navbar-1-3 login-btn" > Login or Create Account </NavLink>
                )}
                {!user && (<NavLink to="/admin/login" className="navbar-1-3 admin-btn" > Admin Login </NavLink>)}
                <button className={`hamburger-btn ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div className={`mobile-menu ${menuOpen ? "show" : "" }`}>
                    <NavLink to="/" onClick={closeMenu} end className={mobileClass} >  🏠
                        <span>Home</span>
                    </NavLink>
                    <NavLink to="/bookings" onClick={closeMenu} className={mobileClass} > 🎫
                        <span>My Bookings</span>
                    </NavLink>
                    <NavLink to="/settings" onClick={closeMenu} className={mobileClass} > ⚙️
                        <span>Settings</span>
                    </NavLink>
                    <NavLink to="/support" onClick={closeMenu} className={mobileClass} > ❓
                        <span>Help & Support</span>
                    </NavLink>
                    {!loading && user && (
                        <button onClick={handleLogout}>
                            <img src={LogoutIcon} alt="Logout" />
                            <span>Logout</span>
                        </button>
                    )}
                    {!loading && user && (
                        <div className="mobile-user-info">
                            <span>👤</span>
                            <div>
                                <small>Logged in as</small>
                                <strong>
                                    {user.name}
                                </strong>
                            </div>
                        </div>
                    )}
                    {!loading && !user && (
                        <NavLink to="/login" onClick={closeMenu} className={({ isActive }) => `mobile-login ${isActive ? "active" : ""}`} > 🔐
                            <span>Login / Create Account</span>
                        </NavLink>
                    )}
                    {!user && (
                        <NavLink to="/admin/login" onClick={closeMenu} className={({ isActive }) => `mobile-admin ${isActive ? "active" : ""}`} > 👨‍💼
                            <span>Admin Login</span>
                        </NavLink>
                    )}
                </div>
            </nav>
        </>
    );
};

export default Navbar;