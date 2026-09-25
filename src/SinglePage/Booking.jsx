import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Booking.css";
const Booking = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { service, id } = useParams();
    const navigate = useNavigate();
    const [serviceData, setServiceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [passengers, setPassengers] = useState(1);
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedBusType, setSelectedBusType] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [bookingLoading, setBookingLoading] = useState(false);
    const formatValue = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return "--";
        }
        if (Array.isArray(value)) {
            return value.join(", ");
        }
        if (typeof value === "object") {
            return Object.entries(value)
                .map(([key, val]) => {
                    if (
                        val !== null &&
                        typeof val === "object"
                    ) {
                        return `${key}: ${JSON.stringify(val)}`;
                    }
                    return `${key}: ${val}`;
                })
                .join(" | ");
        }
        return String(value);
    };
    const getClassFare = (classData) => {
        if (
            classData !== null &&
            typeof classData === "object"
        ) {
            return Number(
                classData?.fare
            ) || 0;
        }
        return Number(classData) || 0;
    };
    const getBusFare = (fareData) => {
        if (
            fareData !== null &&
            typeof fareData === "object"
        ) {
            return Number(
                fareData?.fare
            ) || 0;
        }
        return Number(fareData) || 0;
    };
    useEffect(() => {
        fetchService();
    }, [service, id]);
    const fetchService = async () => {
        try {
            setLoading(true);
            setError("");
            setServiceData(null);
            let endpoint = "";
            switch (service) {
                case "train":
                    endpoint = `${API_URL}/api/trains/${id}`;
                    break;
                case "flight":
                    endpoint = `${API_URL}/api/flights/${id}`;
                    break;
                case "bus":
                    endpoint = `${API_URL}/api/buses/${id}`;
                    break;
                case "cab":
                    endpoint = `${API_URL}/api/cabs/${id}`;
                    break;
                case "hotel":
                    endpoint = `${API_URL}/api/hotels/${id}`;
                    break;
                default:
                    setError("Invalid service");
                    return;
            }
            const response = await axios.get(
                endpoint,
                {
                    withCredentials: true
                }
            );
            const data =
                response.data?.train ||
                response.data?.flight ||
                response.data?.bus ||
                response.data?.cab ||
                response.data?.hotel ||
                response.data?.data ||
                response.data;
            if (!data) {
                throw new Error(
                    "Service details not found"
                );
            }
            setServiceData(data);
            if (
                (service === "train" ||
                    service === "flight") &&
                data.classes &&
                typeof data.classes === "object"
            ) {
                const classNames =
                    Object.keys(data.classes);
                if (classNames.length > 0) {
                    setSelectedClass(
                        classNames[0]
                    );
                }
            }
            if (
                service === "bus" &&
                data.fare &&
                typeof data.fare === "object"
            ) {
                const fareTypes =
                    Object.keys(data.fare);
                if (fareTypes.length > 0) {
                    setSelectedBusType(
                        fareTypes[0]
                    );
                }
            }
            if (
                service === "hotel" &&
                data.rooms &&
                typeof data.rooms === "object"
            ) {
                const roomTypes =
                    Object.keys(data.rooms);
                if (roomTypes.length > 0) {
                    setSelectedRoom(
                        roomTypes[0]
                    );
                }
            }
        } catch (err) {
            console.error(
                "Booking fetch error:",
                err
            );
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load booking details"
            );
        } finally {
            setLoading(false);
        }
    };
    const getSelectedFare = () => {
        if (!serviceData) {
            return 0;
        }
        if (
            service === "train" ||
            service === "flight"
        ) {
            const classData =
                serviceData.classes?.[
                selectedClass
                ];
            return getClassFare(
                classData
            );
        }
        if (service === "bus") {
            return getBusFare(
                serviceData.fare?.[
                selectedBusType
                ]
            );
        }
        if (service === "cab") {
            return (
                Number(
                    serviceData.baseFare
                ) || 0
            );
        }
        return 0;
    };
    const handleBooking = async () => {
        try {
            setBookingLoading(true);
            const bookingData = {
                service,
                serviceId: id,
                passengers,
                selectedClass:
                    service === "train" ||
                        service === "flight"
                        ? selectedClass
                        : "",
                selectedBusType:
                    service === "bus"
                        ? selectedBusType
                        : "",
                selectedRoom:
                    service === "hotel"
                        ? selectedRoom
                        : "",
                farePerPassenger:
                    selectedFare,
                totalFare:
                    selectedFare * passengers
            };
            const response = await axios.post(
                `${API_URL}/api/bookings`,
                {
                    service,
                    serviceId: id,
                    passengers,
                    selectedClass:
                        service === "train" || service === "flight"
                            ? selectedClass
                            : "",
                    selectedBusType:
                        service === "bus"
                            ? selectedBusType
                            : "",
                    selectedRoom:
                        service === "hotel"
                            ? selectedRoom
                            : "",
                    farePerPassenger: selectedFare,
                    totalFare:
                        selectedFare * passengers
                },
                {
                    withCredentials: true
                }
            );
            if (response.data?.success) {
                alert(
                    response.data.message ||
                    "Booking confirmed successfully"
                );
                navigate("/my-bookings");
            } else {
                alert(
                    response.data?.message ||
                    "Booking failed"
                );
            }
        } catch (err) {
            console.error(
                "Booking error:",
                err
            );
            alert(
                err.response?.data?.message ||
                "Unable to process booking"
            );
        } finally {
            setBookingLoading(false);
        }
    };
    if (loading) {
        return (
            <div className="booking-page">
                <div className="booking-loading">
                    Loading booking details...
                </div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="booking-page">
                <div className="booking-error">
                    <h2>
                        Unable to load booking
                    </h2>
                    <p>
                        {formatValue(error)}
                    </p>
                    <button
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        ← Go Back
                    </button>
                </div>
            </div>
        );
    }
    if (!serviceData) {
        return (
            <div className="booking-page">
                <div className="booking-error">
                    No booking information found.
                </div>
            </div>
        );
    }
    const selectedFare =
        getSelectedFare();
    return (
        <div className="booking-page">
            {}
            <div className="booking-header">
                <button
                    className="back-btn"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Back
                </button>
                <h1>
                    Complete Your Booking
                </h1>
                <span className="booking-service">
                    {String(
                        service || ""
                    ).toUpperCase()}
                </span>
            </div>
            <div className="booking-container">
                {}
                <div className="booking-summary">
                    {}
                    {service === "train" && (
                        <>
                            <h2>
                                {formatValue(
                                    serviceData.trainName
                                ) || "Train"}
                            </h2>
                            <div className="booking-route">
                                <div>
                                    <strong>
                                        {formatValue(
                                            serviceData.departure
                                        )}
                                    </strong>
                                    <span>
                                        {formatValue(
                                            serviceData.source
                                        )}
                                    </span>
                                </div>
                                <div className="booking-line">
                                    ─────────🚆
                                </div>
                                <div>
                                    <strong>
                                        {formatValue(
                                            serviceData.arrival
                                        )}
                                    </strong>
                                    <span>
                                        {formatValue(
                                            serviceData.destination
                                        )}
                                    </span>
                                </div>
                            </div>
                            <p>
                                Train No:{" "}
                                {formatValue(
                                    serviceData.trainNo
                                )}
                            </p>
                            <p>
                                Duration:{" "}
                                {formatValue(
                                    serviceData.duration
                                )}
                            </p>
                        </>
                    )}
                    {}
                    {service === "flight" && (
                        <>
                            <h2>
                                {formatValue(
                                    serviceData.airline
                                ) || "Flight"}
                            </h2>
                            <div className="booking-route">
                                <div>
                                    <strong>
                                        {formatValue(
                                            serviceData.departure
                                        )}
                                    </strong>
                                    <span>
                                        {formatValue(
                                            serviceData.sourceCode
                                        )}
                                    </span>
                                </div>
                                <div className="booking-line">
                                    ─────────✈️
                                </div>
                                <div>
                                    <strong>
                                        {formatValue(
                                            serviceData.arrival
                                        )}
                                    </strong>
                                    <span>
                                        {formatValue(
                                            serviceData.destinationCode
                                        )}
                                    </span>
                                </div>
                            </div>
                            <p>
                                Flight No:{" "}
                                {formatValue(
                                    serviceData.flightNo
                                )}
                            </p>
                            <p>
                                Aircraft:{" "}
                                {formatValue(
                                    serviceData.aircraft
                                )}
                            </p>
                            <p>
                                Duration:{" "}
                                {formatValue(
                                    serviceData.duration
                                )}
                            </p>
                            <p>
                                Baggage:{" "}
                                {formatValue(
                                    serviceData.baggage
                                )}
                            </p>
                        </>
                    )}
                    {}
                    {service === "bus" && (
                        <>
                            <h2>
                                {formatValue(
                                    serviceData.busName
                                ) || "Bus"}
                            </h2>
                            <div className="booking-route">
                                <div>
                                    <strong>
                                        {formatValue(
                                            serviceData.departure
                                        )}
                                    </strong>
                                    <span>
                                        {formatValue(
                                            serviceData.source
                                        )}
                                    </span>
                                </div>
                                <div className="booking-line">
                                    ─────────🚌
                                </div>
                                <div>
                                    <strong>
                                        {formatValue(
                                            serviceData.arrival
                                        )}
                                    </strong>
                                    <span>
                                        {formatValue(
                                            serviceData.destination
                                        )}
                                    </span>
                                </div>
                            </div>
                            <p>
                                Bus No:{" "}
                                {formatValue(
                                    serviceData.busNo
                                )}
                            </p>
                            <p>
                                Operator:{" "}
                                {formatValue(
                                    serviceData.operator
                                )}
                            </p>
                            <p>
                                Bus Type:{" "}
                                {formatValue(
                                    serviceData.busType
                                )}
                            </p>
                        </>
                    )}
                    {}
                    {service === "cab" && (
                        <>
                            <h2>
                                {formatValue(
                                    serviceData.carModel
                                ) || "Cab"}
                            </h2>
                            <p>
                                🚕{" "}
                                {formatValue(
                                    serviceData.carModel
                                )}
                            </p>
                            <p>
                                Operator:{" "}
                                {formatValue(
                                    serviceData.operator
                                )}
                            </p>
                            <p>
                                City:{" "}
                                {formatValue(
                                    serviceData.city
                                )}
                            </p>
                            <p>
                                Driver:{" "}
                                {formatValue(
                                    serviceData.driverName
                                )}
                            </p>
                            <p>
                                Capacity:{" "}
                                {formatValue(
                                    serviceData.capacity
                                )} seats
                            </p>
                        </>
                    )}
                    {}
                    {service === "hotel" && (
                        <>
                            <h2>
                                {formatValue(
                                    serviceData.name
                                ) || "Hotel"}
                            </h2>
                            <p>
                                📍{" "}
                                {formatValue(
                                    serviceData.area
                                )},{" "}
                                {formatValue(
                                    serviceData.city
                                )}
                            </p>
                            <p>
                                ⭐{" "}
                                {formatValue(
                                    serviceData.rating
                                )}
                            </p>
                            <p>
                                Check-in:{" "}
                                {formatValue(
                                    serviceData.checkIn
                                )}
                            </p>
                            <p>
                                Check-out:{" "}
                                {formatValue(
                                    serviceData.checkOut
                                )}
                            </p>
                        </>
                    )}
                </div>
                {}
                <div className="booking-form">
                    <h2>
                        Booking Details
                    </h2>
                    {}
                    {service !== "hotel" && (
                        <div className="form-group">
                            <label>
                                Number of Passengers
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={passengers}
                                onChange={(e) =>
                                    setPassengers(
                                        Math.max(
                                            1,
                                            Number(
                                                e.target.value
                                            ) || 1
                                        )
                                    )
                                }
                            />
                        </div>
                    )}
                    {}
                    {(service === "train" ||
                        service === "flight") &&
                        serviceData.classes &&
                        typeof serviceData.classes === "object" && (
                            <div className="form-group">
                                <label>
                                    Select Class
                                </label>
                                <select
                                    value={selectedClass}
                                    onChange={(e) =>
                                        setSelectedClass(
                                            e.target.value
                                        )
                                    }
                                >
                                    {Object.entries(
                                        serviceData.classes
                                    ).map(
                                        (
                                            [
                                                className,
                                                classData
                                            ]
                                        ) => {
                                            const fare =
                                                getClassFare(
                                                    classData
                                                );
                                            return (
                                                <option
                                                    key={className}
                                                    value={className}
                                                >
                                                    {className}
                                                    {" - ₹"}
                                                    {fare}
                                                </option>
                                            );
                                        }
                                    )}
                                </select>
                            </div>
                        )}
                    {}
                    {service === "bus" &&
                        serviceData.fare &&
                        typeof serviceData.fare === "object" && (
                            <div className="form-group">
                                <label>
                                    Select Bus Type
                                </label>
                                <select
                                    value={selectedBusType}
                                    onChange={(e) =>
                                        setSelectedBusType(
                                            e.target.value
                                        )
                                    }
                                >
                                    {Object.entries(
                                        serviceData.fare
                                    ).map(
                                        (
                                            [
                                                fareType,
                                                fare
                                            ]
                                        ) => (
                                            <option
                                                key={fareType}
                                                value={fareType}
                                            >
                                                {fareType}
                                                {" - ₹"}
                                                {getBusFare(
                                                    fare
                                                )}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        )}
                    {}
                    {service === "cab" && (
                        <div className="fare-box">
                            <span>
                                Base Fare
                            </span>
                            <strong>
                                ₹
                                {Number(
                                    serviceData.baseFare
                                ) || 0}
                            </strong>
                            <small>
                                ₹
                                {Number(
                                    serviceData.farePerKm
                                ) || 0}
                                /km
                            </small>
                        </div>
                    )}
                    {}
                    {service === "hotel" &&
                        serviceData.rooms &&
                        typeof serviceData.rooms === "object" && (
                            <div className="form-group">
                                <label>
                                    Select Room
                                </label>
                                <select
                                    value={selectedRoom}
                                    onChange={(e) =>
                                        setSelectedRoom(
                                            e.target.value
                                        )
                                    }
                                >
                                    {Object.entries(
                                        serviceData.rooms
                                    ).map(
                                        (
                                            [
                                                roomType,
                                                count
                                            ]
                                        ) => (
                                            <option
                                                key={roomType}
                                                value={roomType}
                                            >
                                                {roomType}
                                                {" - "}
                                                {Number(
                                                    count
                                                ) || 0}
                                                {" rooms"}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                        )}
                    {}
                    {(service === "train" ||
                        service === "flight" ||
                        service === "bus" ||
                        service === "cab") && (
                            <div className="fare-box">
                                <span>
                                    Estimated Total
                                </span>
                                <strong>
                                    ₹
                                    {(
                                        selectedFare *
                                        passengers
                                    ).toLocaleString(
                                        "en-IN"
                                    )}
                                </strong>
                                <small>
                                    {passengers}
                                    {" passenger"}
                                    {passengers > 1
                                        ? "s"
                                        : ""}
                                </small>
                            </div>
                        )}
                    {}
                    <button
                        type="button"
                        className="confirm-booking-btn"
                        onClick={handleBooking}
                        disabled={bookingLoading}
                    >
                        {bookingLoading
                            ? "Processing..."
                            : "Confirm Booking →"}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Booking;