import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./SinglePage.css";
const API_URL = import.meta.env.VITE_API_URL;
const SinglePage = () => {
    const { service, id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchService = async () => {
            try {
                setLoading(true);
                
                setError("");
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
                        throw new Error("Invalid service type");
                }
                const response = await axios.get(endpoint);
                const serviceData =
                    response.data.train ||
                    response.data.flight ||
                    response.data.bus ||
                    response.data.cab ||
                    response.data.hotel ||
                    response.data.data;
                setData(serviceData);
            } catch (err) {
                console.error(
                    "Single service error:",
                    err
                );
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load service details"
                );
            } finally {
                setLoading(false);
            }
        };
        if (service && id) {
            fetchService();
        }
    }, [service, id]);
    if (loading) {
        return (
            <div className="single-page">
                <div className="single-loading">
                    Loading {service} details...
                </div>
            </div>
        );
    }
    if (error || !data) {
        return (
            <div className="single-page">
                <div className="single-error">
                    <div>
                        ❌
                    </div>
                    <h2>
                        Service Not Found
                    </h2>
                    <p>
                        {error ||
                            "Unable to find the requested service."}
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
    const getTitle = () => {
        switch (service) {
            case "train":
                return data.trainName;
            case "flight":
                return data.airline;
            case "bus":
                return data.busName;
            case "cab":
                return data.carModel;
            case "hotel":
                return data.name;
            default:
                return "Service Details";
        }
    };
    const getFare = (fareData) => {
        if (
            fareData !== null &&
            typeof fareData === "object"
        ) {
            return fareData?.fare ?? "N/A";
        }
        return fareData ?? "N/A";
    };
    return (
        <div className="single-page">
            {}
            <div className="single-header">
                <button
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Back
                </button>
                <div>
                    <span>
                        {service.toUpperCase()}
                    </span>
                    <h1>
                        {getTitle()}
                    </h1>
                </div>
            </div>
            <div className="single-container">
                {}
                {service === "train" && (
                    <>
                        <div className="single-route">
                            <div>
                                <small>
                                    Departure
                                </small>
                                <h2>
                                    {data.departure || "--"}
                                </h2>
                                <strong>
                                    {data.source || "--"}
                                </strong>
                            </div>
                            <div className="route-middle">
                                <span>
                                    {data.duration || "--"}
                                </span>
                                <div>
                                    ─────────🚆
                                </div>
                            </div>
                            <div>
                                <small>
                                    Arrival
                                </small>
                                <h2>
                                    {data.arrival || "--"}
                                </h2>
                                <strong>
                                    {data.destination || "--"}
                                </strong>
                            </div>
                        </div>
                        <div className="detail-grid">
                            <Detail
                                label="Train Number"
                                value={data.trainNo}
                            />
                            <Detail
                                label="Distance"
                                value={`${data.distance || 0} km`}
                            />
                            <Detail
                                label="Operating Days"
                                value={
                                    Array.isArray(
                                        data.on_which_day
                                    )
                                        ? data.on_which_day.join(", ")
                                        : "-"
                                }
                            />
                        </div>
                        <Section title="Classes & Fares">
                            <div className="card-grid">
                                {Object.entries(
                                    data.classes || {}
                                ).map(
                                    ([name, fareData]) => {
                                        const fare =
                                            getFare(fareData);
                                        return (
                                            <InfoCard
                                                key={name}
                                                title={name}
                                                value={`₹${fare}`}
                                                subtitle={
                                                    `${data.seatAvailability?.[name] ?? 0} seats available`
                                                }
                                            />
                                        );
                                    }
                                )}
                            </div>
                        </Section>
                        <Section title="Stops">
                            <div className="stops-list">
                                {Object.entries(
                                    data.stops || {}
                                ).map(
                                    ([key, stop]) => (
                                        <div
                                            className="stop-item"
                                            key={key}
                                        >
                                            <strong>
                                                {stop?.station || "--"}
                                            </strong>
                                            <span>
                                                Arrival:{" "}
                                                {stop?.arrival || "--"}
                                            </span>
                                            <span>
                                                Departure:{" "}
                                                {stop?.departure || "--"}
                                            </span>
                                            <span>
                                                Distance:{" "}
                                                {stop?.distance ?? 0} km
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </Section>
                    </>
                )}
                {}
                {service === "flight" && (
                    <>
                        <div className="single-route">
                            <div>
                                <small>
                                    Departure
                                </small>
                                <h2>
                                    {data.departure || "--"}
                                </h2>
                                <strong>
                                    {data.sourceCode || "--"}
                                </strong>
                                <span>
                                    {data.source || "--"}
                                </span>
                            </div>
                            <div className="route-middle">
                                <span>
                                    {data.duration || "--"}
                                </span>
                                <div>
                                    ─────────✈️
                                </div>
                                <small>
                                    Direct
                                </small>
                            </div>
                            <div>
                                <small>
                                    Arrival
                                </small>
                                <h2>
                                    {data.arrival || "--"}
                                </h2>
                                <strong>
                                    {data.destinationCode || "--"}
                                </strong>
                                <span>
                                    {data.destination || "--"}
                                </span>
                            </div>
                        </div>
                        <div className="detail-grid">
                            <Detail
                                label="Flight Number"
                                value={data.flightNo}
                            />
                            <Detail
                                label="Airline"
                                value={data.airline}
                            />
                            <Detail
                                label="Aircraft"
                                value={data.aircraft}
                            />
                            <Detail
                                label="Baggage"
                                value={data.baggage}
                            />
                            <Detail
                                label="Operating Days"
                                value={
                                    Array.isArray(
                                        data.on_which_day
                                    )
                                        ? data.on_which_day.join(", ")
                                        : "-"
                                }
                            />
                        </div>
                        {}
                        <Section title="Classes & Fares">
                            <div className="card-grid">
                                {Object.entries(
                                    data.classes || {}
                                ).map(
                                    ([name, classData]) => {
                                        const fare =
                                            getFare(classData);
                                        return (
                                            <InfoCard
                                                key={name}
                                                title={name}
                                                value={`₹${fare}`}
                                                subtitle={
                                                    `${data.seatAvailability?.[name] ?? 0} seats available`
                                                }
                                            />
                                        );
                                    }
                                )}
                            </div>
                        </Section>
                    </>
                )}
                {}
                {service === "bus" && (
                    <>
                        <div className="single-route">
                            <div>
                                <small>
                                    Departure
                                </small>
                                <h2>
                                    {data.departure || "--"}
                                </h2>
                                <strong>
                                    {data.source || "--"}
                                </strong>
                            </div>
                            <div className="route-middle">
                                <span>
                                    {data.duration || "--"}
                                </span>
                                <div>
                                    ─────────🚌
                                </div>
                            </div>
                            <div>
                                <small>
                                    Arrival
                                </small>
                                <h2>
                                    {data.arrival || "--"}
                                </h2>
                                <strong>
                                    {data.destination || "--"}
                                </strong>
                            </div>
                        </div>
                        <div className="detail-grid">
                            <Detail
                                label="Bus Number"
                                value={data.busNo}
                            />
                            <Detail
                                label="Operator"
                                value={data.operator}
                            />
                            <Detail
                                label="Bus Type"
                                value={data.busType}
                            />
                            <Detail
                                label="Distance"
                                value={`${data.distance || 0} km`}
                            />
                            <Detail
                                label="Total Seats"
                                value={data.totalSeats}
                            />
                            <Detail
                                label="Available Seats"
                                value={data.availableSeats}
                            />
                            <Detail
                                label="Rating"
                                value={data.rating}
                            />
                        </div>
                        <Section title="Fare">
                            <div className="card-grid">
                                {Object.entries(
                                    data.fare || {}
                                ).map(
                                    ([name, fare]) => (
                                        <InfoCard
                                            key={name}
                                            title={name}
                                            value={`₹${getFare(fare)}`}
                                        />
                                    )
                                )}
                            </div>
                        </Section>
                        <Section title="Amenities">
                            <div className="tag-list">
                                {(
                                    data.amenities || []
                                ).map(
                                    (item, index) => (
                                        <span key={index}>
                                            {typeof item === "object"
                                                ? JSON.stringify(item)
                                                : item}
                                        </span>
                                    )
                                )}
                            </div>
                        </Section>
                        <Section title="Stops">
                            <div className="stops-list">
                                {Object.entries(
                                    data.stops || {}
                                ).map(
                                    ([key, stop]) => (
                                        <div
                                            className="stop-item"
                                            key={key}
                                        >
                                            <strong>
                                                {stop?.station || "--"}
                                            </strong>
                                            <span>
                                                Arrival:{" "}
                                                {stop?.arrival || "--"}
                                            </span>
                                            <span>
                                                Departure:{" "}
                                                {stop?.departure || "--"}
                                            </span>
                                        </div>
                                    )
                                )}
                            </div>
                        </Section>
                    </>
                )}
                {}
                {service === "cab" && (
                    <>
                        <div className="detail-grid">
                            <Detail
                                label="Cab ID"
                                value={data.cabId}
                            />
                            <Detail
                                label="Operator"
                                value={data.operator}
                            />
                            <Detail
                                label="Cab Type"
                                value={data.cabType}
                            />
                            <Detail
                                label="Car Model"
                                value={data.carModel}
                            />
                            <Detail
                                label="City"
                                value={data.city}
                            />
                            <Detail
                                label="Driver"
                                value={data.driverName}
                            />
                            <Detail
                                label="Capacity"
                                value={data.capacity}
                            />
                            <Detail
                                label="Rating"
                                value={data.rating}
                            />
                            <Detail
                                label="Base Fare"
                                value={`₹${data.baseFare ?? 0}`}
                            />
                            <Detail
                                label="Fare / KM"
                                value={`₹${data.farePerKm ?? 0}`}
                            />
                            <Detail
                                label="Status"
                                value={data.status}
                            />
                        </div>
                    </>
                )}
                {}
                {service === "hotel" && (
                    <>
                        <div className="detail-grid">
                            <Detail
                                label="Hotel ID"
                                value={data.hotelId}
                            />
                            <Detail
                                label="Hotel Name"
                                value={data.name}
                            />
                            <Detail
                                label="City"
                                value={data.city}
                            />
                            <Detail
                                label="Area"
                                value={data.area}
                            />
                            <Detail
                                label="Stars"
                                value={`${data.stars ?? 0} ★`}
                            />
                            <Detail
                                label="Rating"
                                value={data.rating}
                            />
                            <Detail
                                label="Check In"
                                value={data.checkIn}
                            />
                            <Detail
                                label="Check Out"
                                value={data.checkOut}
                            />
                        </div>
                        <Section title="Rooms">
                            <div className="card-grid">
                                {Object.entries(
                                    data.rooms || {}
                                ).map(
                                    ([room, count]) => (
                                        <InfoCard
                                            key={room}
                                            title={room}
                                            value={`${count} rooms`}
                                        />
                                    )
                                )}
                            </div>
                        </Section>
                    </>
                )}
                {}
                <div className="single-action">
                    <button
                        onClick={() =>
                            navigate(
                                `/booking/${service}/${id}`
                            )
                        }
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};
const Detail = ({
    label,
    value
}) => {
    let displayValue = value;
    if (
        value !== null &&
        typeof value === "object"
    ) {
        if (Array.isArray(value)) {
            displayValue = value.join(", ");
        } else {
            displayValue = Object.entries(value)
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
    }
    if (
        displayValue === null ||
        displayValue === undefined ||
        displayValue === ""
    ) {
        displayValue = "-";
    }
    return (
        <div className="detail-box">
            <span>
                {label}
            </span>
            <strong>
                {displayValue}
            </strong>
        </div>
    );
};
const Section = ({
    title,
    children
}) => {
    return (
        <section className="single-section">
            <h2>
                {title}
            </h2>
            {children}
        </section>
    );
};
const InfoCard = ({
    title,
    value,
    subtitle
}) => {
    let displayValue = value;
    if (
        value !== null &&
        typeof value === "object"
    ) {
        if (Array.isArray(value)) {
            displayValue = value.join(", ");
        } else {
            displayValue = Object.entries(value)
                .map(([key, val]) =>
                    `${key}: ${val}`
                )
                .join(" | ");
        }
    }
    return (
        <div className="info-card">
            <div>
                <h3>
                    {title}
                </h3>
                {subtitle && (
                    <span>
                        {subtitle}
                    </span>
                )}
            </div>
            <strong>
                {displayValue ?? "-"}
            </strong>
        </div>
    );
};
export default SinglePage;