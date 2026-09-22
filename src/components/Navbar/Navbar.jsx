import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

import Logo from "../../assets/logo.png";
import LogoutIcon from "../../assets/logout.png";

const Navbar = () => {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };
    return (
        <nav className="navbar-1">
            <Link to="/" className="navbar-1-1">
                <img src={Logo} alt="BookMyJourney" />
            </Link>
            <div className="navbar-1-2">
                <div className="bodyNav">
                    <Link to="/bookings" className="tab-btn" >🎫 My Bookings </Link>
                    <Link to="/favourites" className="tab-btn" > ❤️ Favourites </Link>
                    <Link to="/settings" className="tab-btn" > ⚙️ Settings </Link>
                    <Link to="/support" className="tab-btn" > ❓ Help & Support </Link>
                    <button onClick={logout} className="tab-btn logout-btn" >
                        <img src={LogoutIcon} alt="Logout" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
            <Link to="/login" className="navbar-1-3" > Login or Create Account </Link>
            <Link to="/admin/login" className="navbar-1-3 admin-btn" > Admin Login </Link>
            <Link to="/profile" className="navbar-1-4" > <p id="pName"></p> </Link>
        </nav>
    );
};

export default Navbar;