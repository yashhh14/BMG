import "./Flights.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ServiceMenu from "../../components/ServiceMenu/ServiceMenu";
import SearchLoader from "../../components/SearchLoader/SearchLoader";
import PageLoader from "../../components/PageLoader/PageLoader";
const API_URL = import.meta.env.VITE_API_URL;
const Flights = () => {
    const navigate = useNavigate();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const searchFlights = async (e) => {
        e.preventDefault();
        if (!from || !to) {
            setError("Please enter departure and destination");
            return;
        }
        try {
            setLoading(true);
            setError("");
            setFlights([]);
            const startTime = Date.now();
            const response = await axios.get(
                `${API_URL}/api/flights`,
                {
                    params: {
                        from,
                        to
                    }
                }
            );
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(
                2500 - elapsedTime,
                0
            );
            await new Promise((resolve) =>
                setTimeout(resolve, remainingTime)
            );
            setFlights(
                response.data.flights || []
            );
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to search flights"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="flights-page">
            { }
            {loading && (
                <PageLoader type="flight" />
            )}
            { }
            <section className="flight-hero">
                <div className="flight-overlay"></div>
                <div className="flight-content">
                    <p className="flight-tag">
                        FLY WITH EASE
                    </p>
                    <h1>
                        Find Your Perfect
                        <span> Flight</span>
                    </h1>
                    <p>
                        Search flights, compare options and
                        plan your next journey.
                    </p>
                    { }
                    <ServiceMenu />
                    <form
                        className="flight-search"
                        onSubmit={searchFlights}
                    >
                        { }
                        <div className="flight-input">
                            <span>📍</span>
                            <div>
                                <input
                                    type="text"
                                    placeholder="From"
                                    value={from}
                                    onChange={(e) =>
                                        setFrom(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        { }
                        <button
                            type="button"
                            className="flight-swap"
                            onClick={() => {
                                setFrom(to);
                                setTo(from);
                            }}
                        >
                            ⇄
                        </button>
                        { }
                        <div className="flight-input">
                            <span>📍</span>
                            <div>
                                <input
                                    type="text"
                                    placeholder="To"
                                    value={to}
                                    onChange={(e) =>
                                        setTo(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        { }
                        <div className="flight-input">
                            <span>📅</span>
                            <div>
                                <label>
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        { }
                        <button
                            type="submit"
                            className="flight-search-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Searching..."
                                : "Search Flights →"}
                        </button>
                    </form>
                </div>
            </section>
            { }
            <section className="flight-results">
                { }
                {error && (
                    <div className="flight-error">
                        {error}
                    </div>
                )}
                { }
                {loading && (
                    <SearchLoader type="flight" />
                )}
                { }
                {!loading &&
                    flights.length === 0 &&
                    !error && (
                        <div className="empty-flights">
                            <div>
                                ✈️
                            </div>
                            <h2>
                                Search for a flight
                            </h2>
                            <p>
                                Enter your departure and
                                destination to find available
                                flights.
                            </p>
                        </div>
                    )
                }
                { }
                {loading && (
                    <div className="flight-loading">
                        Searching for flights...
                    </div>
                )}
                { }
                {!loading &&
                    flights.map((flight) => {
                        const economyFare =
                            typeof flight.classes?.Economy === "object"
                                ? flight.classes?.Economy?.fare
                                : flight.classes?.Economy;
                        return (
                            <div
                                className="flight-card"
                                key={flight.flightNo}
                            >
                                { }
                                <div className="flight-airline">
                                    <div className="airline-logo">
                                        ✈️
                                    </div>
                                    <div>
                                        <h3>
                                            {flight.airline}
                                        </h3>
                                        <span>
                                            {flight.flightNo}
                                        </span>
                                    </div>
                                </div>
                                { }
                                <div className="flight-route">
                                    <div>
                                        <strong>
                                            {flight.departure}
                                        </strong>
                                        <span>
                                            {flight.sourceCode}
                                        </span>
                                    </div>
                                    { }
                                    <div className="flight-duration">
                                        <span>
                                            {flight.duration}
                                        </span>
                                        <div className="route-line">
                                            ─────────✈
                                        </div>
                                        <small>
                                            Direct
                                        </small>
                                    </div>
                                    <div>
                                        <strong>
                                            {flight.arrival}
                                        </strong>
                                        <span>
                                            {flight.destinationCode}
                                        </span>
                                    </div>
                                </div>
                                { }
                                <div className="flight-price">
                                    <span>
                                        Starting from
                                    </span>
                                    <strong>
                                        ₹{economyFare ?? "N/A"}
                                    </strong>
                                    { }
                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/single/flight/${flight.flightNo}`
                                            )
                                        }
                                    >
                                        View Flight →
                                    </button>
                                </div>
                            </div>
                        );
                    })}
            </section>
        </div>
    );
};
export default Flights;