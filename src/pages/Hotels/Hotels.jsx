import "./Hotels.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ServiceMenu from "../../components/ServiceMenu/ServiceMenu";
import SearchLoader from "../../components/SearchLoader/SearchLoader";
import PageLoader from "../../components/PageLoader/PageLoader";

const Hotels = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const [city, setCity] = useState("");
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const searchHotels = async (e) => {
        e.preventDefault();

        if (!city) {
            setError("Please enter a city");
            return;
        }

        const startTime = Date.now();

        try {
            setLoading(true);
            setError("");
            setHotels([]);

            const response = await axios.get(`${API_URL}/api/hotels`, {
                params: {
                    city
                }
            });

            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(1500 - elapsedTime, 0);

            await new Promise((resolve) =>
                setTimeout(resolve, remainingTime)
            );

            setHotels(response.data.hotels || []);
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Unable to search hotels"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hotels-page">
            {loading && <PageLoader type="hotel" />}

            <section className="hotel-hero">
                <div className="hotel-overlay"></div>

                <div className="hotel-content">
                    <p className="hotel-tag">🏨 FIND YOUR STAY</p>

                    <h1>
                        Stay Somewhere
                        <span> Amazing</span>
                    </h1>

                    <p>
                        Discover comfortable hotels and
                        find the perfect stay for your journey.
                    </p>

                    <ServiceMenu />

                    <form
                        className="hotel-search"
                        onSubmit={searchHotels}
                    >
                        <div className="hotel-input">
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
                            className="hotel-search-btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Searching..."
                                : "Search Hotels →"}
                        </button>
                    </form>
                </div>
            </section>

            <section className="hotel-results">
                {error && (
                    <div className="hotel-error">
                        {error}
                    </div>
                )}

                {loading && <SearchLoader type="hotel" />}

                {loading && (
                    <div className="hotel-loading">
                        Searching for hotels...
                    </div>
                )}

                {!loading && hotels.length === 0 && !error && (
                    <div className="empty-hotels">
                        <div>🏨</div>
                        <h2>Search for a hotel</h2>
                        <p>
                            Enter your city to find
                            available hotels.
                        </p>
                    </div>
                )}

                {!loading &&
                    hotels.map((hotel) => (
                        <div
                            className="hotel-card"
                            key={hotel.hotelId}
                        >
                            <div className="hotel-image">
                                {hotel.images?.[0] ? (
                                    <img
                                        src={hotel.images[0]}
                                        alt={hotel.name}
                                    />
                                ) : (
                                    <span>🏨</span>
                                )}
                            </div>

                            <div className="hotel-info">
                                <h3>{hotel.name}</h3>

                                <span>
                                    📍 {hotel.area}, {hotel.city}
                                </span>

                                <div className="hotel-rating">
                                    ⭐ {hotel.rating}

                                    <span>
                                        {hotel.stars} Star
                                    </span>
                                </div>

                                <p>
                                    {hotel.amenities
                                        ?.slice(0, 4)
                                        .join(" • ")}
                                </p>
                            </div>

                            <div className="hotel-details">
                                <span>Check-in</span>
                                <strong>{hotel.checkIn}</strong>

                                <span>Check-out</span>
                                <strong>{hotel.checkOut}</strong>
                            </div>

                            <div className="hotel-action">
                                <span>Available Rooms</span>

                                <strong>
                                    {typeof hotel.rooms === "object"
                                        ? Object.values(hotel.rooms).reduce(
                                            (total, room) =>
                                                total +
                                                (Number(room) || 0),
                                            0
                                        )
                                        : hotel.rooms ?? "N/A"}
                                </strong>

                                <button
                                    onClick={() =>
                                        navigate(
                                            `/single/hotel/${hotel.hotelId}`
                                        )
                                    }
                                >
                                    View Hotel →
                                </button>
                            </div>
                        </div>
                    ))}
            </section>
        </div>
    );
};

export default Hotels;