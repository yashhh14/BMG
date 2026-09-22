import "./Buses.css";
import { useState } from "react";
import axios from "axios";

import ServiceMenu from "../../components/ServiceMenu/ServiceMenu";

const Buses = () => {

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [buses, setBuses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchBuses = async (e) => {

        e.preventDefault();

        if (!from || !to) {
            setError("Please enter departure and destination");
            return;
        }

        try {

            setLoading(true);
            setError("");
            setBuses([]);

            const response = await axios.get(
                "http://localhost:8000/api/buses",
                {
                    params: {
                        from,
                        to
                    }
                }
            );

            setBuses(response.data.buses || []);

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to search buses"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="buses-page">

            <section className="bus-hero">

                <div className="bus-overlay"></div>

                <div className="bus-content">

                    <p className="bus-tag">
                        🚌 TRAVEL BY BUS
                    </p>

                    <h1>
                        Find Your Perfect
                        <span> Bus</span>
                    </h1>

                    <p>
                        Search buses, compare operators and
                        find comfortable journeys.
                    </p>

                    <ServiceMenu />

                    <form
                        className="bus-search"
                        onSubmit={searchBuses}
                    >

                        <div className="bus-input">

                            <span>📍</span>

                            <div>
                                <label>From</label>

                                <input
                                    type="text"
                                    placeholder="Delhi"
                                    value={from}
                                    onChange={(e) =>
                                        setFrom(e.target.value)
                                    }
                                />
                            </div>

                        </div>

                        <button
                            type="button"
                            className="bus-swap"
                            onClick={() => {
                                setFrom(to);
                                setTo(from);
                            }}
                        >
                            ⇄
                        </button>

                        <div className="bus-input">

                            <span>📍</span>

                            <div>
                                <label>To</label>

                                <input
                                    type="text"
                                    placeholder="Mumbai"
                                    value={to}
                                    onChange={(e) =>
                                        setTo(e.target.value)
                                    }
                                />
                            </div>

                        </div>

                        <div className="bus-input">

                            <span>📅</span>

                            <div>
                                <label>Date</label>

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(e.target.value)
                                    }
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="bus-search-btn"
                        >
                            {loading
                                ? "Searching..."
                                : "Search Buses →"}
                        </button>

                    </form>

                </div>
            </section>

            <section className="bus-results">

                {error && (
                    <div className="bus-error">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="bus-loading">
                        Searching for buses...
                    </div>
                )}

                {!loading &&
                    buses.length === 0 &&
                    !error && (
                        <div className="empty-buses">

                            <div>🚌</div>

                            <h2>
                                Search for a bus
                            </h2>

                            <p>
                                Enter your departure and
                                destination to find available buses.
                            </p>

                        </div>
                    )}

                {buses.map((bus) => (

                    <div
                        className="bus-card"
                        key={bus.busNo}
                    >

                        <div className="bus-info">

                            <div className="bus-logo">
                                🚌
                            </div>

                            <div>

                                <h3>
                                    {bus.busName}
                                </h3>

                                <span>
                                    {bus.operator}
                                </span>

                                <small>
                                    {bus.busNo}
                                </small>

                            </div>

                        </div>

                        <div className="bus-route">

                            <div>

                                <strong>
                                    {bus.departure}
                                </strong>

                                <span>
                                    {bus.source}
                                </span>

                            </div>

                            <div className="bus-duration">

                                <span>
                                    {bus.duration}
                                </span>

                                <div className="bus-line">
                                    ─────────🚌
                                </div>

                                <small>
                                    {bus.distance} km
                                </small>

                            </div>

                            <div>

                                <strong>
                                    {bus.arrival}
                                </strong>

                                <span>
                                    {bus.destination}
                                </span>

                            </div>

                        </div>

                        <div className="bus-price">

                            <span>
                                Starting from
                            </span>

                            <strong>
                                ₹{bus.fare?.Sleeper ||
                                    bus.fare?.Seater ||
                                    "N/A"}
                            </strong>

                            <small>
                                Seats: {bus.availableSeats}
                            </small>

                            <button>
                                View Bus →
                            </button>

                        </div>

                    </div>

                ))}

            </section>

        </div>
    );
};

export default Buses;