import "./Trains.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ServiceMenu from "../../components/ServiceMenu/ServiceMenu";
import PageLoader from "../../components/PageLoader/PageLoader";
const API_URL = import.meta.env.VITE_API_URL;
const Trains = () => {
    const navigate = useNavigate();
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const searchTrains = async (e) => {
        e.preventDefault();
        if (!from || !to) {
            setError("Please enter departure and destination");
            return;
        }
        const startTime = Date.now();
        try {
            setLoading(true);
            setError("");
            setTrains([]);
            const response = await axios.get(
                `${API_URL}api/trains`,
                {
                    params: {
                        from,
                        to
                    }
                }
            );
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(
                2000 - elapsedTime,
                0
            );
            await new Promise((resolve) =>
                setTimeout(resolve, remainingTime)
            );
            setTrains(
                response.data.trains || []
            );
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to search trains"
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="trains-page">
            { }
            <section className="train-hero">
                <div className="train-overlay"></div>
                <div className="train-content">
                    <p className="train-tag">
                        🚆 TRAVEL BY TRAIN
                    </p>
                    <h1>
                        Find Your Perfect
                        <span> Train</span>
                    </h1>
                    <p>
                        Search trains, compare timings and
                        plan your next railway journey.
                    </p>
                    <ServiceMenu />
                    { }
                    <form
                        className="train-search"
                        onSubmit={searchTrains}
                    >
                        { }
                        <div className="train-input">
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
                            className="train-swap"
                            onClick={() => {
                                setFrom(to);
                                setTo(from);
                            }}
                        >
                            ⇄
                        </button>
                        { }
                        <div className="train-input">
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
                        <div className="train-input">
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
                            className="train-search-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Searching..."
                                : "Search Trains →"}
                        </button>
                    </form>
                </div>
            </section>
            { }
            <section className="train-results">
                { }
                {error && (
                    <div className="train-error">
                        {error}
                    </div>
                )}
                { }
                {loading && (
                    <PageLoader type="train" />
                )}
                { }
                {!loading &&
                    trains.length === 0 &&
                    !error && (
                        <div className="empty-trains">
                            <div>🚆</div>
                            <h2>
                                Search for a train
                            </h2>
                            <p>
                                Enter your departure and
                                destination to find available trains.
                            </p>
                        </div>
                    )}
                { }
                {!loading &&
                    trains.map((train) => (
                        <div
                            className="train-card"
                            key={train.trainNo}
                        >
                            { }
                            <div className="train-info">
                                <div className="train-logo">
                                    🚆
                                </div>
                                <div>
                                    <h3>
                                        {train.trainName}
                                    </h3>
                                    <span>
                                        Train No: {train.trainNo}
                                    </span>
                                </div>
                            </div>
                            { }
                            <div className="train-route">
                                <div>
                                    <strong>
                                        {train.departure}
                                    </strong>
                                    <span>
                                        {train.source}
                                    </span>
                                </div>
                                { }
                                <div className="train-duration">
                                    <span>
                                        {train.duration}
                                    </span>
                                    <div className="train-line">
                                        ─────────🚆
                                    </div>
                                    <small>
                                        {train.distance} km
                                    </small>
                                </div>
                                <div>
                                    <strong>
                                        {train.arrival}
                                    </strong>
                                    <span>
                                        {train.destination}
                                    </span>
                                </div>
                            </div>
                            { }
                            <div className="train-action">
                                <span>
                                    Classes
                                </span>
                                <strong>
                                    {train.classes
                                        ? Object.keys(
                                            train.classes
                                        ).join(", ")
                                        : "Available"}
                                </strong>
                                { }
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/single/train/${train.trainNo}`
                                        )
                                    }
                                >
                                    View Train →
                                </button>
                            </div>
                        </div>
                    ))}
            </section>
        </div>
    );
};
export default Trains;
