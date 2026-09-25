import "./Cabs.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ServiceMenu from "../../components/ServiceMenu/ServiceMenu";
import SearchLoader from "../../components/SearchLoader/SearchLoader";
import PageLoader from "../../components/PageLoader/PageLoader";

const Cabs = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [city, setCity] = useState("");
    const [cabs, setCabs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchCabs = async (e) => {
        e.preventDefault();

        if (!city) {
            setError("Please enter a city");
            return;
        }

        const startTime = Date.now();

        try {
            setLoading(true);
            setError("");
            setCabs([]);

            const response = await axios.get(`${API_URL}/api/cabs`, {
                params: {
                    city
                }
            });

            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(1500 - elapsedTime, 0);

            await new Promise((resolve) =>
                setTimeout(resolve, remainingTime)
            );

            setCabs(response.data.cabs || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to search cabs"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cabs-page">
            {loading && <PageLoader type="cab" />}

            <section className="cab-hero">
                <div className="cab-overlay"></div>

                <div className="cab-content">
                    <p className="cab-tag">🚕 BOOK A CAB</p>

                    <h1>
                        Your Ride,
                        <span> Your Way</span>
                    </h1>

                    <p>
                        Find reliable cabs and comfortable rides
                        wherever you go.
                    </p>

                    <ServiceMenu />

                    <form className="cab-search" onSubmit={searchCabs}>
                        <div className="cab-input">
                            <span>📍</span>

                            <div>
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={city}
                                    onChange={(e) =>
                                        setCity(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="cab-search-btn"
                            disabled={loading}
                        >
                            {loading ? "Searching..." : "Search Cabs →"}
                        </button>
                    </form>
                </div>
            </section>

            <section className="cab-results">
                {error && (
                    <div className="cab-error">
                        {error}
                    </div>
                )}

                {loading && <SearchLoader type="cab" />}

                {loading && (
                    <div className="cab-loading">
                        Searching for cabs...
                    </div>
                )}

                {!loading && cabs.length === 0 && !error && (
                    <div className="empty-cabs">
                        <div>🚕</div>
                        <h2>Search for a cab</h2>
                        <p>
                            Enter your city to find
                            available cabs.
                        </p>
                    </div>
                )}

                {!loading &&
                    cabs.map((cab) => (
                        <div
                            className="cab-card"
                            key={cab.cabId}
                        >
                            <div className="cab-info">
                                <div className="cab-logo">🚕</div>

                                <div>
                                    <h3>{cab.carModel}</h3>
                                    <span>{cab.operator}</span>
                                </div>
                            </div>

                            <div className="cab-details">
                                <div>
                                    <span>Type</span>
                                    <strong>{cab.cabType}</strong>
                                </div>

                                <div>
                                    <span>Capacity</span>
                                    <strong>{cab.capacity} Seats</strong>
                                </div>

                                <div>
                                    <span>Rating</span>
                                    <strong>⭐ {cab.rating}</strong>
                                </div>

                                <div>
                                    <span>Status</span>
                                    <strong>{cab.status}</strong>
                                </div>
                            </div>

                            <div className="cab-price">
                                <span>Base Fare</span>
                                <strong>₹{cab.baseFare}</strong>
                                <small>₹{cab.farePerKm}/km</small>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/single/cab/${cab.cabId}`
                                        )
                                    }
                                >
                                    View Cab →
                                </button>
                            </div>
                        </div>
                    ))}
            </section>
        </div>
    );
};

export default Cabs;