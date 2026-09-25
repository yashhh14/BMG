import React, { useState } from "react";
import axios from "axios";
import { useAdmin } from "../../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import "./AdminFlights.css";
const API_URL = import.meta.env.VITE_API_URL;
const AdminFlights = () => {
    const navigate = useNavigate();
    const {
        flights,
        loading,
        setFlights
    } = useAdmin();
    const [editingFlight, setEditingFlight] = useState(null);
    const [isAddingFlight, setIsAddingFlight] = useState(false);
    const [saving, setSaving] = useState(false);
    const handleAddFlight = () => {
        setIsAddingFlight(true);
        setEditingFlight({
            flightNo: "",
            airline: "",
            source: "",
            destination: "",
            sourceCode: "",
            destinationCode: "",
            departure: "",
            arrival: "",
            duration: "",
            aircraft: "",
            baggage: "",
            on_which_day: [],
            seatAvailability: {
                Economy: 0,
                Business: 0
            },
            classes: {
                Economy: {
                    fare: 0
                },
                Business: {
                    fare: 0
                }
            }
        });
    };
    const handleDelete = async (flightNo) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete flight ${flightNo}?`
        );
        if (!confirmDelete) {
            return;
        }
        try {
            await axios.delete(
                `${API_URL}api/flights/${flightNo}`,
                {
                    withCredentials: true
                }
            );
            setFlights((prevFlights) =>
                prevFlights.filter(
                    (flight) =>
                        flight.flightNo !== flightNo
                )
            );
            alert(
                "Flight deleted successfully"
            );
        } catch (error) {
            console.error(
                "Delete flight error:",
                error
            );
            alert(
                error.response?.data?.message ||
                "Failed to delete flight"
            );
        }
    };
    const handleEdit = (flight) => {
        setIsAddingFlight(false);
        setEditingFlight(
            JSON.parse(
                JSON.stringify(flight)
            )
        );
    };
    const handleFieldChange = (
        field,
        value
    ) => {
        setEditingFlight((prev) => ({
            ...prev,
            [field]: value
        }));
    };
    const handleDaysChange = (value) => {
        const days = value
            .split(",")
            .map((day) => day.trim())
            .filter(Boolean);
        setEditingFlight((prev) => ({
            ...prev,
            on_which_day: days
        }));
    };
    const handleSeatChange = (
        className,
        value
    ) => {
        setEditingFlight((prev) => ({
            ...prev,
            seatAvailability: {
                ...prev.seatAvailability,
                [className]:
                    Number(value) || 0
            }
        }));
    };
    const handleClassChange = (
        className,
        field,
        value
    ) => {
        setEditingFlight((prev) => ({
            ...prev,
            classes: {
                ...prev.classes,
                [className]: {
                    ...prev.classes?.[className],
                    [field]:
                        field === "fare"
                            ? Number(value) || 0
                            : value
                }
            }
        }));
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (
            !editingFlight?.flightNo ||
            !editingFlight?.airline ||
            !editingFlight?.source ||
            !editingFlight?.destination
        ) {
            alert(
                "Flight Number, Airline, Source and Destination are required."
            );
            return;
        }
        try {
            setSaving(true);
            if (isAddingFlight) {
                const response = await axios.post(
                    `${API_URL}api/admin/flights`,
                    {
                        flightNo:
                            editingFlight.flightNo.trim(),
                        airline:
                            editingFlight.airline.trim(),
                        source:
                            editingFlight.source.trim(),
                        destination:
                            editingFlight.destination.trim(),
                        sourceCode:
                            editingFlight.sourceCode
                                ?.trim()
                                .toUpperCase(),
                        destinationCode:
                            editingFlight.destinationCode
                                ?.trim()
                                .toUpperCase(),
                        departure:
                            editingFlight.departure,
                        arrival:
                            editingFlight.arrival,
                        duration:
                            editingFlight.duration,
                        aircraft:
                            editingFlight.aircraft,
                        baggage:
                            editingFlight.baggage,
                        on_which_day:
                            Array.isArray(
                                editingFlight.on_which_day
                            )
                                ? editingFlight.on_which_day
                                : [],
                        seatAvailability:
                            editingFlight.seatAvailability ||
                            {},
                        classes:
                            editingFlight.classes ||
                            {}
                    },
                    {
                        withCredentials: true
                    }
                );
                const newFlight =
                    response.data.flight ||
                    response.data.newFlight ||
                    editingFlight;
                setFlights((prevFlights) => [
                    ...prevFlights,
                    newFlight
                ]);
                alert(
                    "Flight added successfully"
                );
            }
            else {
                const response = await axios.patch(
                    `${API_URL}api/flights/${editingFlight.flightNo}`,
                    editingFlight,
                    {
                        withCredentials: true
                    }
                );
                const updatedFlight =
                    response.data.flight ||
                    response.data.updatedFlight ||
                    editingFlight;
                setFlights((prevFlights) =>
                    prevFlights.map((flight) =>
                        flight.flightNo ===
                            editingFlight.flightNo
                            ? updatedFlight
                            : flight
                    )
                );
                alert(
                    "Flight updated successfully"
                );
            }
            setEditingFlight(null);
            setIsAddingFlight(false);
        } catch (error) {
            console.error(
                "Save flight error:",
                error
            );
            alert(
                error.response?.data?.message ||
                "Failed to save flight"
            );
        } finally {
            setSaving(false);
        }
    };
    const closeModal = () => {
        if (saving) {
            return;
        }
        setEditingFlight(null);
        setIsAddingFlight(false);
    };
    return (
        <div className="admin-service-page">
            <div className="admin-service-header">
                <div>
                    <h1>
                        ✈️ Manage Flights
                    </h1>
                    <p>
                        View, add, edit and delete flight services
                    </p>
                </div>
                <div className="admin-header-actions">
                    <button
                        className="add-train-header-btn"
                        onClick={handleAddFlight}
                    >
                        + Add Flight
                    </button>
                    <button
                        className="dashboard-btn"
                        onClick={() =>
                            navigate(
                                "/admin/dashboard"
                            )
                        }
                    >
                        ← Dashboard
                    </button>
                </div>
            </div>
            {loading ? (
                <div className="admin-loading">
                    Loading flights...
                </div>
            ) : flights.length === 0 ? (
                <div className="admin-empty">
                    No flights available.
                </div>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>
                                    Flight No
                                </th>
                                <th>
                                    Airline
                                </th>
                                <th>
                                    Source
                                </th>
                                <th>
                                    Destination
                                </th>
                                <th>
                                    Departure
                                </th>
                                <th>
                                    Arrival
                                </th>
                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {flights.map(
                                (flight) => (
                                    <tr
                                        key={
                                            flight.flightNo
                                        }
                                    >
                                        <td>
                                            {
                                                flight.flightNo
                                            }
                                        </td>
                                        <td>
                                            {
                                                flight.airline
                                            }
                                        </td>
                                        <td>
                                            {
                                                flight.source
                                            }
                                            {flight.sourceCode && (
                                                <small>
                                                    {" "}
                                                    (
                                                    {
                                                        flight.sourceCode
                                                    }
                                                    )
                                                </small>
                                            )}
                                        </td>
                                        <td>
                                            {
                                                flight.destination
                                            }
                                            {flight.destinationCode && (
                                                <small>
                                                    {" "}
                                                    (
                                                    {
                                                        flight.destinationCode
                                                    }
                                                    )
                                                </small>
                                            )}
                                        </td>
                                        <td>
                                            {
                                                flight.departure
                                            }
                                        </td>
                                        <td>
                                            {
                                                flight.arrival
                                            }
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="edit-btn"
                                                    onClick={() =>
                                                        handleEdit(
                                                            flight
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            flight.flightNo
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            )}
            {editingFlight && (
                <div className="flight-edit-overlay">
                    <form
                        className="flight-edit-modal"
                        onSubmit={handleSave}
                    >
                        <div className="flight-modal-header">
                            <div>
                                <h2>
                                    {isAddingFlight
                                        ? "✈️ Add Flight"
                                        : "✈️ Edit Flight"
                                    }
                                </h2>
                                <p>
                                    {isAddingFlight
                                        ? "Add complete flight information"
                                        : "Update complete flight information"
                                    }
                                </p>
                            </div>
                            <button
                                type="button"
                                className="close-modal-btn"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                ×
                            </button>
                        </div>
                        <div className="flight-section">
                            <h3>
                                Basic Information
                            </h3>
                            <div className="flight-form-grid">
                                <div className="flight-input-group">
                                    <label>
                                        Flight Number
                                    </label>
                                    <input
                                        value={
                                            editingFlight.flightNo ||
                                            ""
                                        }
                                        disabled={
                                            !isAddingFlight
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "flightNo",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. AI101"
                                    />
                                </div>
                                <div className="flight-input-group">
                                    <label>
                                        Airline
                                    </label>
                                    <input
                                        value={
                                            editingFlight.airline ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "airline",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Air India"
                                    />
                                </div>
                                <div className="flight-input-group">
                                    <label>
                                        Aircraft
                                    </label>
                                    <input
                                        value={
                                            editingFlight.aircraft ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "aircraft",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Boeing 737"
                                    />
                                </div>
                                <div className="flight-input-group">
                                    <label>
                                        Baggage
                                    </label>
                                    <input
                                        value={
                                            editingFlight.baggage ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "baggage",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. 15 KG"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flight-section">
                            <h3>
                                Route Information
                            </h3>
                            <div className="flight-form-grid">
                                <div className="flight-input-group">
                                    <label>
                                        Source
                                    </label>
                                    <input
                                        value={
                                            editingFlight.source ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "source",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Hyderabad"
                                    />
                                </div>
                                <div className="flight-input-group">
                                    <label>
                                        Source Airport Code
                                    </label>
                                    <input
                                        value={
                                            editingFlight.sourceCode ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "sourceCode",
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder="e.g. HYD"
                                    />
                                </div>
                                <div className="flight-input-group">
                                    <label>
                                        Destination
                                    </label>
                                    <input
                                        value={
                                            editingFlight.destination ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "destination",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Delhi"
                                    />
                                </div>
                                <div className="flight-input-group">
                                    <label>
                                        Destination Airport Code
                                    </label>
                                    <input
                                        value={
                                            editingFlight.destinationCode ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "destinationCode",
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        placeholder="e.g. DEL"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flight-section">
                            <h3>
                                Schedule
                            </h3>
                            <div className="flight-form-grid">
                                <div className="flight-input-group">
                                    <label>
                                        Departure
                                    </label>
                                    <input
                                        value={
                                            editingFlight.departure ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "departure",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. 06:30"
                                    />
                                </div>
                                <div className="flight-input-group">
                                    <label>
                                        Arrival
                                    </label>
                                    <input
                                        value={
                                            editingFlight.arrival ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "arrival",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. 08:45"
                                    />
                                </div>
                                <div className="flight-input-group">
                                    <label>
                                        Duration
                                    </label>
                                    <input
                                        value={
                                            editingFlight.duration ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "duration",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. 2h 15m"
                                    />
                                </div>
                                <div className="flight-input-group">
                                    <label>
                                        Operating Days
                                    </label>
                                    <input
                                        value={
                                            Array.isArray(
                                                editingFlight.on_which_day
                                            )
                                                ? editingFlight.on_which_day.join(
                                                    ", "
                                                )
                                                : editingFlight.on_which_day ||
                                                ""
                                        }
                                        onChange={(e) =>
                                            handleDaysChange(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Mon, Tue, Wed"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flight-section">
                            <h3>
                                Seat Availability
                            </h3>
                            <div className="flight-form-grid">
                                {Object.entries(
                                    editingFlight.seatAvailability ||
                                    {}
                                ).map(
                                    ([className, seats]) => (
                                        <div
                                            className="flight-input-group"
                                            key={className}
                                        >
                                            <label>
                                                {className}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={
                                                    seats ??
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleSeatChange(
                                                        className,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="flight-section">
                            <h3>
                                Flight Classes & Fares
                            </h3>
                            <div className="flight-class-container">
                                {Object.entries(
                                    editingFlight.classes ||
                                    {}
                                ).map(
                                    (
                                        [
                                            className,
                                            classData
                                        ]
                                    ) => (
                                        <div
                                            className="flight-class-card"
                                            key={className}
                                        >
                                            <h4>
                                                {className}
                                            </h4>
                                            {typeof classData ===
                                                "object" &&
                                                classData !== null ? (
                                                <div className="flight-form-grid">
                                                    {Object.entries(
                                                        classData
                                                    ).map(
                                                        (
                                                            [
                                                                field,
                                                                value
                                                            ]
                                                        ) => (
                                                            <div
                                                                className="flight-input-group"
                                                                key={field}
                                                            >
                                                                <label>
                                                                    {field}
                                                                </label>
                                                                <input
                                                                    type={
                                                                        typeof value ===
                                                                            "number"
                                                                            ? "number"
                                                                            : "text"
                                                                    }
                                                                    min={
                                                                        typeof value ===
                                                                            "number"
                                                                            ? "0"
                                                                            : undefined
                                                                    }
                                                                    value={
                                                                        value ??
                                                                        ""
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleClassChange(
                                                                            className,
                                                                            field,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flight-input-group">
                                                    <label>
                                                        Value
                                                    </label>
                                                    <input
                                                        value={
                                                            classData ??
                                                            ""
                                                        }
                                                        onChange={(e) =>
                                                            setEditingFlight(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    classes: {
                                                                        ...prev.classes,
                                                                        [className]:
                                                                            e
                                                                                .target
                                                                                .value
                                                                    }
                                                                })
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="flight-modal-actions">
                            <button
                                type="button"
                                className="cancel-flight-btn"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="save-flight-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : isAddingFlight
                                        ? "Add Flight"
                                        : "Save Changes"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};
export default AdminFlights;