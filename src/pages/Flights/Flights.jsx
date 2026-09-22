import "./Flights.css";
import{ useState } from "react";
import axios from "axios";
import ServiceMenu from "../../components/ServiceMenu/ServiceMenu";

const Flights = () => {
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
            const response = await axios.get("http://localhost:8000/api/flights",
                {
                    params: {
                        from,
                        to
                    }
                }
            );

            setFlights(response.data.flights);

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

            {/* ================= HERO ================= */}

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


                    {/* ================= SEARCH ================= */}

                    <ServiceMenu />
                    <form
                        className="flight-search"
                        onSubmit={searchFlights}
                    >

                        {/* From */}

                        <div className="flight-input">

                            <span>📍</span>

                            <div>

                                <label>
                                    From
                                </label>

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


                        {/* Swap */}

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


                        {/* To */}

                        <div className="flight-input">

                            <span>📍</span>

                            <div>

                                <label>
                                    To
                                </label>

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


                        {/* Date */}

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


                        {/* Search */}

                        <button
                            type="submit"
                            className="flight-search-btn"
                        >
                            {loading
                                ? "Searching..."
                                : "Search Flights →"}
                        </button>

                    </form>

                </div>

            </section>


            {/* ================= RESULTS ================= */}

            <section className="flight-results">

                {error && (
                    <div className="flight-error">
                        {error}
                    </div>
                )}


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


                {loading && (
                    <div className="flight-loading">
                        Searching for flights...
                    </div>
                )}


                {flights.map((flight) => (

                    <div
                        className="flight-card"
                        key={flight.flightNo}
                    >

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


                        <div className="flight-route">

                            <div>

                                <strong>
                                    {flight.departure}
                                </strong>

                                <span>
                                    {flight.sourceCode}
                                </span>

                            </div>


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


                        <div className="flight-price">

                            <span>
                                Starting from
                            </span>

                            <strong>
                                ₹{flight.classes?.Economy}
                            </strong>

                            <button>
                                View Flight →
                            </button>

                        </div>

                    </div>

                ))}

            </section>

        </div>
    );
};

export default Flights;