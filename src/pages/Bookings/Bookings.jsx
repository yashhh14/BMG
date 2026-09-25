import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Bookings.css";
import HomeBg from "../../assets/hero_background.png";

const API_URL = import.meta.env.VITE_API_URL;
const Bookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState({
        trains: [],
        flights: [],
        buses: [],
        cabs: [],
        hotels: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}api/me`,
                {
                    withCredentials: true
                }
            );

            console.log("User data:", response.data);

            const user = response.data.user;

            setBookings({
                trains: user?.booking?.trains || [],
                flights: user?.booking?.flights || [],
                buses: user?.booking?.buses || [],
                cabs: user?.booking?.cabs || [],
                hotels: user?.booking?.hotels || []
            });

        } catch (err) {

            console.error("Fetch bookings error:", err);

            if (err.response?.status === 401) {
                setError("Please login to view your bookings.");
            } else {
                setError(
                    err.response?.data?.message ||
                    "Unable to load bookings"
                );
            }

        } finally {
            setLoading(false);
        }
    };


    const getAllBookings = () => {

        return [
            ...bookings.trains.map(item => ({
                ...item,
                service: "train"
            })),

            ...bookings.flights.map(item => ({
                ...item,
                service: "flight"
            })),

            ...bookings.buses.map(item => ({
                ...item,
                service: "bus"
            })),

            ...bookings.cabs.map(item => ({
                ...item,
                service: "cab"
            })),

            ...bookings.hotels.map(item => ({
                ...item,
                service: "hotel"
            }))
        ];
    };


    const allBookings = getAllBookings();


    const getServiceIcon = (service) => {

        switch (service) {

            case "train":
                return "🚆";

            case "flight":
                return "✈️";

            case "bus":
                return "🚌";

            case "cab":
                return "🚕";

            case "hotel":
                return "🏨";

            default:
                return "🎫";
        }
    };


    const getServiceName = (service) => {

        switch (service) {

            case "train":
                return "Train";

            case "flight":
                return "Flight";

            case "bus":
                return "Bus";

            case "cab":
                return "Cab";

            case "hotel":
                return "Hotel";

            default:
                return "Booking";
        }
    };


    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    const handleExplore = () => {
        navigate("/");
    };


    return (
        <div
            className="bookings-page"
            style={{
                backgroundImage: `url(${HomeBg})`
            }}
        >

            <div className="bookings-header">

                <span>🎫</span>

                <div>
                    <h1>My Bookings</h1>

                    <p>
                        Manage all your upcoming and previous journeys.
                    </p>
                </div>

            </div>

            {loading && (
                <div className="empty-bookings">

                    <div className="empty-icon">
                        ⏳
                    </div>

                    <h2>Loading bookings...</h2>

                    <p>
                        Please wait while we fetch your bookings.
                    </p>

                </div>
            )}


            {!loading && error && (
                <div className="empty-bookings">

                    <div className="empty-icon">
                        🔐
                    </div>

                    <h2>{error}</h2>

                    <button onClick={() => navigate("/login")}>
                        Login →
                    </button>

                </div>
            )}


            {!loading &&
                !error &&
                allBookings.length === 0 && (

                    <div className="empty-bookings">

                        <div className="empty-icon">
                            🎫
                        </div>

                        <h2>No bookings yet</h2>

                        <p>
                            Your booked flights, trains, buses, cabs
                            and hotels will appear here.
                        </p>

                        <button onClick={handleExplore}>
                            Explore Services →
                        </button>

                    </div>
                )}


            {!loading &&
                !error &&
                allBookings.length > 0 && (

                    <div className="bookings-list">

                        {allBookings.map((booking, index) => (

                            <div
                                className="booking-card"
                                key={
                                    booking.bookingId ||
                                    `${booking.service}-${index}`
                                }
                            >

                                <div className="booking-card-header">

                                    <div className="booking-service">

                                        <span className="service-icon">
                                            {getServiceIcon(
                                                booking.service
                                            )}
                                        </span>

                                        <div>

                                            <h2>
                                                {getServiceName(
                                                    booking.service
                                                )}
                                            </h2>

                                            <p>
                                                Booking ID:{" "}
                                                <strong>
                                                    {booking.bookingId}
                                                </strong>
                                            </p>

                                        </div>

                                    </div>


                                    <span
                                        className={`booking-status ${booking.status?.toLowerCase()}`}
                                    >
                                        {booking.status || "Confirmed"}
                                    </span>

                                </div>


                                <div className="booking-details">

                                    <div>
                                        <span>Service ID</span>

                                        <strong>
                                            {booking.serviceId || "-"}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>Passengers</span>

                                        <strong>
                                            {booking.passengers || 1}
                                        </strong>
                                    </div>


                                    {booking.selectedClass && (
                                        <div>
                                            <span>Class</span>

                                            <strong>
                                                {booking.selectedClass}
                                            </strong>
                                        </div>
                                    )}


                                    {booking.selectedBusType && (
                                        <div>
                                            <span>Bus Type</span>

                                            <strong>
                                                {booking.selectedBusType}
                                            </strong>
                                        </div>
                                    )}


                                    {booking.selectedRoom && (
                                        <div>
                                            <span>Room</span>

                                            <strong>
                                                {booking.selectedRoom}
                                            </strong>
                                        </div>
                                    )}


                                    <div>
                                        <span>Total Fare</span>

                                        <strong>
                                            ₹
                                            {Number(
                                                booking.totalFare || 0
                                            ).toLocaleString("en-IN")}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>Booked On</span>

                                        <strong>
                                            {formatDate(
                                                booking.bookedAt
                                            )}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

        </div>
    );
};

export default Bookings;