import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../context/AdminContext";
import axios from "axios";
import "./Dashboard.css";
import PageLoader from "../../../components/PageLoader/PageLoader";
const API_URL = import.meta.env.VITE_API_URL;
const Dashboard = () => {
    const navigate = useNavigate();
    const {
        trainTotal,
        flights,
        buses,
        cabs,
        hotels,
        loading
    } = useAdmin();
    const handleLogout = async () => {
        try {
            await axios.post(
                `${API_URL}api/admin/logout`,
                {},
                {
                    withCredentials: true
                }
            );
            navigate("/admin/login");
        } catch (error) {
            console.error(
                "Logout error:",
                error
            );
        }
    };
    return (
        <div className="admin-dashboard">
            {loading && (
                <PageLoader type="loading" />
            )}
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>
                        BookMyJourney
                    </h2>
                    <span>
                        Admin Panel
                    </span>
                </div>
                <nav className="admin-nav">
                    <button
                        className="admin-nav-item active"
                        onClick={() =>
                            navigate(
                                "/admin/dashboard"
                            )
                        }
                    >
                        📊 Dashboard
                    </button>
                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate(
                                "/admin/trains"
                            )
                        }
                    >
                        🚆 Trains
                    </button>
                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate(
                                "/admin/flights"
                            )
                        }
                    >
                        ✈️ Flights
                    </button>
                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate(
                                "/admin/buses"
                            )
                        }
                    >
                        🚌 Buses
                    </button>
                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate(
                                "/admin/cabs"
                            )
                        }
                    >
                        🚕 Cabs
                    </button>
                    <button
                        className="admin-nav-item"
                        onClick={() =>
                            navigate(
                                "/admin/hotels"
                            )
                        }
                    >
                        🏨 Hotels
                    </button>
                </nav>
                <button
                    className="admin-logout"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>
            </aside>
            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <h1>
                            Dashboard
                        </h1>
                        <p>
                            Welcome to the BookMyJourney admin panel
                        </p>
                    </div>
                    <div className="admin-profile">
                        👨‍💼
                        <span>
                            Administrator
                        </span>
                    </div>
                </header>
                <section className="admin-stats">
                    <div className="admin-stat-card">
                        <div className="stat-icon">
                            🚆
                        </div>
                        <div>
                            <span>
                                Total Trains
                            </span>
                            <h2>
                                {loading
                                    ? "..."
                                    : trainTotal.toLocaleString()
                                }
                            </h2>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon">
                            ✈️
                        </div>
                        <div>
                            <span>
                                Total Flights
                            </span>
                            <h2>
                                {loading
                                    ? "..."
                                    : flights.length
                                }
                            </h2>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon">
                            🚌
                        </div>
                        <div>
                            <span>
                                Total Buses
                            </span>
                            <h2>
                                {loading
                                    ? "..."
                                    : buses.length
                                }
                            </h2>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon">
                            🚕
                        </div>
                        <div>
                            <span>
                                Total Cabs
                            </span>
                            <h2>
                                {loading
                                    ? "..."
                                    : cabs.length
                                }
                            </h2>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="stat-icon">
                            🏨
                        </div>
                        <div>
                            <span>
                                Total Hotels
                            </span>
                            <h2>
                                {loading
                                    ? "..."
                                    : hotels.length
                                }
                            </h2>
                        </div>
                    </div>
                </section>
                <section className="admin-management">
                    <h2>
                        Manage Services
                    </h2>
                    <div className="management-grid">
                        <div
                            className="management-card"
                            onClick={() =>
                                navigate(
                                    "/admin/trains"
                                )
                            }
                        >
                            <span>
                                🚆
                            </span>
                            <h3>
                                Manage Trains
                            </h3>
                            <p>
                                View, edit and delete trains
                            </p>
                            <button>
                                Manage →
                            </button>
                        </div>
                        <div
                            className="management-card"
                            onClick={() =>
                                navigate(
                                    "/admin/flights"
                                )
                            }
                        >
                            <span>
                                ✈️
                            </span>
                            <h3>
                                Manage Flights
                            </h3>
                            <p>
                                View, edit and delete flights
                            </p>
                            <button>
                                Manage →
                            </button>
                        </div>
                        <div
                            className="management-card"
                            onClick={() =>
                                navigate(
                                    "/admin/buses"
                                )
                            }
                        >
                            <span>
                                🚌
                            </span>
                            <h3>
                                Manage Buses
                            </h3>
                            <p>
                                View, edit and delete buses
                            </p>
                            <button>
                                Manage →
                            </button>
                        </div>
                        <div
                            className="management-card"
                            onClick={() =>
                                navigate(
                                    "/admin/cabs"
                                )
                            }
                        >
                            <span>
                                🚕
                            </span>
                            <h3>
                                Manage Cabs
                            </h3>
                            <p>
                                View, edit and delete cabs
                            </p>
                            <button>
                                Manage →
                            </button>
                        </div>
                        <div
                            className="management-card"
                            onClick={() =>
                                navigate(
                                    "/admin/hotels"
                                )
                            }
                        >
                            <span>
                                🏨
                            </span>
                            <h3>
                                Manage Hotels
                            </h3>
                            <p>
                                View, edit and delete hotels
                            </p>
                            <button>
                                Manage →
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};
export default Dashboard;