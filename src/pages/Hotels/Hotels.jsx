import "./Hotels.css";
import { useState } from "react";
import axios from "axios";
import ServiceMenu from "../../components/ServiceMenu/ServiceMenu";

const Hotels = () => {

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

        try {

            setLoading(true);
            setError("");
            setHotels([]);

            const response = await axios.get(
                "http://localhost:8000/api/hotels",
                {
                    params: {
                        city
                    }
                }
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

            <section className="hotel-hero">

                <div className="hotel-overlay"></div>

                <div className="hotel-content">

                    <p className="hotel-tag">
                        🏨 FIND YOUR STAY
                    </p>

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
                            className="hotel-search-btn"
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

                {loading && (
                    <div className="hotel-loading">
                        Searching for hotels...
                    </div>
                )}

                {!loading &&
                    hotels.length === 0 &&
                    !error && (
                        <div className="empty-hotels">

                            <div>🏨</div>

                            <h2>
                                Search for a hotel
                            </h2>

                            <p>
                                Enter your city to find
                                available hotels.
                            </p>

                        </div>
                    )}

                {hotels.map((hotel) => (

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

                            <h3>
                                {hotel.name}
                            </h3>

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
                                {hotel.amenities?.slice(0, 4).join(" • ")}
                            </p>

                        </div>

                        <div className="hotel-details">

                            <span>
                                Check-in
                            </span>

                            <strong>
                                {hotel.checkIn}
                            </strong>

                            <span>
                                Check-out
                            </span>

                            <strong>
                                {hotel.checkOut}
                            </strong>

                        </div>

                        <div className="hotel-action">

                            <span>
                                Available Rooms
                            </span>

                            <strong>
                                {hotel.rooms}
                            </strong>

                            <button>
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