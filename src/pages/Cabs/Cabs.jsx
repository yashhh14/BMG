import "./Cabs.css";
import { useState } from "react";
import axios from "axios";
import ServiceMenu from "../../components/ServiceMenu/ServiceMenu";

const Cabs = () => {

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

        try {

            setLoading(true);
            setError("");
            setCabs([]);

            const response = await axios.get(
                "http://localhost:8000/api/cabs",
                {
                    params: {
                        city
                    }
                }
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

            <section className="cab-hero">

                <div className="cab-overlay"></div>

                <div className="cab-content">

                    <p className="cab-tag">
                        🚕 BOOK A CAB
                    </p>

                    <h1>
                        Your Ride,
                        <span> Your Way</span>
                    </h1>

                    <p>
                        Find reliable cabs and comfortable rides
                        wherever you go.
                    </p>

                    <ServiceMenu />

                    <form
                        className="cab-search"
                        onSubmit={searchCabs}
                    >

                        <div className="cab-input">

                            <span>📍</span>

                            <div>

                                <label>
                                    City
                                </label>

                                <input
                                    type="text"
                                    placeholder="Hyderabad"
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
                        >
                            {loading
                                ? "Searching..."
                                : "Search Cabs →"}
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

                {loading && (
                    <div className="cab-loading">
                        Searching for cabs...
                    </div>
                )}

                {!loading &&
                    cabs.length === 0 &&
                    !error && (
                        <div className="empty-cabs">

                            <div>🚕</div>

                            <h2>
                                Search for a cab
                            </h2>

                            <p>
                                Enter your city to find
                                available cabs.
                            </p>

                        </div>
                    )}

                {cabs.map((cab) => (

                    <div
                        className="cab-card"
                        key={cab.cabId}
                    >

                        <div className="cab-info">

                            <div className="cab-logo">
                                🚕
                            </div>

                            <div>

                                <h3>
                                    {cab.carModel}
                                </h3>

                                <span>
                                    {cab.operator}
                                </span>

                            </div>

                        </div>

                        <div className="cab-details">

                            <div>
                                <span>Type</span>
                                <strong>
                                    {cab.cabType}
                                </strong>
                            </div>

                            <div>
                                <span>Capacity</span>
                                <strong>
                                    {cab.capacity} Seats
                                </strong>
                            </div>

                            <div>
                                <span>Rating</span>
                                <strong>
                                    ⭐ {cab.rating}
                                </strong>
                            </div>

                            <div>
                                <span>Status</span>
                                <strong>
                                    {cab.status}
                                </strong>
                            </div>

                        </div>

                        <div className="cab-price">

                            <span>
                                Base Fare
                            </span>

                            <strong>
                                ₹{cab.baseFare}
                            </strong>

                            <small>
                                ₹{cab.farePerKm}/km
                            </small>

                            <button>
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