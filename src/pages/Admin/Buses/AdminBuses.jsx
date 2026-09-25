import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdmin } from "../../../context/AdminContext";
import "./AdminBuses.css";
const API_URL = import.meta.env.VITE_API_URL;
const AdminBuses = () => {
    const navigate = useNavigate();
    const { buses, loading, setBuses } = useAdmin();
    const [search, setSearch] = useState("");
    const [editingBus, setEditingBus] = useState(null);
    const [isAddingBus, setIsAddingBus] = useState(false);
    const [saving, setSaving] = useState(false);
    const filteredBuses = (buses || []).filter((bus) => {
        const value = search.toLowerCase();
        return (String(bus.busNo || "").toLowerCase().includes(value) ||
            String(bus.busName || "").toLowerCase().includes(value) ||
            String(bus.operator || "").toLowerCase().includes(value) ||
            String(bus.source || "").toLowerCase().includes(value) ||
            String(bus.destination || "").toLowerCase().includes(value));
    });
    const handleAddBus = () => {
        setEditingBus({
            busNo: "",
            busName: "",
            operator: "",
            busType: "",
            source: "",
            destination: "",
            departure: "",
            arrival: "",
            duration: "",
            distance: 0,
            fare: {
                AC: 0,
                NonAC: 0
            },
            totalSeats: 0,
            availableSeats: 0,
            amenities: [],
            rating: 0,
            stops: [],
            on_which_day: []
        });
        setIsAddingBus(true);
    };
    const handleDelete = async (busNo) => {
        if (!window.confirm(`Delete bus ${busNo}?`)) {
            return;
        }
        try {
            await axios.delete(`${API_URL}api/buses/${busNo}`, {
                withCredentials: true
            });
            setBuses((prev) => prev.filter((bus) => bus.busNo !== busNo));
            alert("Bus deleted successfully");
        }
        catch (error) {
            alert(error.response?.data?.message || "Failed to delete bus");
        }
    };
    const handleEdit = (bus) => {
        const copiedBus = JSON.parse(JSON.stringify(bus));
        if (copiedBus.stops && typeof copiedBus.stops === "object" && !Array.isArray(copiedBus.stops)) {
            copiedBus.stops = Object.keys(copiedBus.stops).sort((a, b) => Number(a) - Number(b)).map((key) => ({
                station: copiedBus.stops[key]?.station ?? "",
                arrival: copiedBus.stops[key]?.arrival ?? "",
                departure: copiedBus.stops[key]?.departure ?? "",
                distance: copiedBus.stops[key]?.distance ?? 0
            }));
        }
        if (!Array.isArray(copiedBus.stops)) {
            copiedBus.stops = [];
        }
        if (!copiedBus.fare || typeof copiedBus.fare !== "object") {
            copiedBus.fare = {};
        }
        if (!Array.isArray(copiedBus.amenities)) {
            copiedBus.amenities = [];
        }
        if (!Array.isArray(copiedBus.on_which_day)) {
            copiedBus.on_which_day = [];
        }
        setEditingBus(copiedBus);
        setIsAddingBus(false);
    };
    const handleFieldChange = (field, value) => {
        setEditingBus((prev) => ({ ...prev, [field]: value }));
    };
    const handleStopChange = (index, field, value) => {
        setEditingBus((prev) => {
            const updatedStops = [...(prev.stops || [])];
            updatedStops[index] = { ...updatedStops[index], [field]: value };
            return { ...prev, stops: updatedStops };
        });
    };
    const addStop = () => {
        setEditingBus((prev) => ({
            ...prev, stops: [...(prev.stops || []),
            {
                station: "",
                arrival: "",
                departure: "",
                distance: 0
            }
            ]
        }));
    };
    const removeStop = (index) => {
        setEditingBus((prev) => ({ ...prev, stops: prev.stops.filter((_, i) => i !== index) }));
    };
    const handleFareChange = (fareType, value) => {
        setEditingBus((prev) => ({
            ...prev,
            fare: {
                ...prev.fare,
                [fareType]: Number(value)
            }
        }));
    };
    const handleAmenityChange = (index, value) => {
        setEditingBus((prev) => {
            const updatedAmenities = [
                ...(prev.amenities || [])
            ];
            updatedAmenities[index] = value;
            return {
                ...prev,
                amenities: updatedAmenities
            };
        });
    };
    const addAmenity = () => {
        setEditingBus((prev) => ({
            ...prev,
            amenities: [
                ...(prev.amenities || []),
                ""
            ]
        }));
    };
    const removeAmenity = (index) => {
        setEditingBus((prev) => ({
            ...prev,
            amenities: prev.amenities.filter((_, i) => i !== index)
        }));
    };
    const toggleDay = (day) => {
        setEditingBus((prev) => {
            const currentDays = prev.on_which_day || [];
            const exists = currentDays.includes(day);
            return {
                ...prev,
                on_which_day: exists
                    ? currentDays.filter((item) => item !== day)
                    : [
                        ...currentDays,
                        day
                    ]
            };
        });
    };
    const handleSave = async (e) => {
        e.preventDefault();
        if (!editingBus.busNo?.trim()) {
            alert("Bus number is required");
            return;
        }
        if (!editingBus.busName?.trim()) {
            alert("Bus name is required");
            return;
        }
        if (!editingBus.operator?.trim()) {
            alert("Operator is required");
            return;
        }
        if (!editingBus.busType?.trim()) {
            alert("Bus type is required");
            return;
        }
        if (!editingBus.source?.trim()) {
            alert("Source is required");
            return;
        }
        if (!editingBus.destination?.trim()) {
            alert("Destination is required");
            return;
        }
        try {
            setSaving(true);
            const stopsObject = {};
            (editingBus.stops || []).forEach((stop, index) => {
                stopsObject[index] = {
                    station: stop.station || "",
                    arrival: stop.arrival || "",
                    departure: stop.departure || "",
                    distance: Number(stop.distance) || 0
                };
            });
            const busData = {
                busName: editingBus.busName.trim(),
                operator: editingBus.operator.trim(),
                busType: editingBus.busType.trim(),
                source: editingBus.source.trim(),
                destination: editingBus.destination.trim(),
                departure: editingBus.departure || "",
                arrival: editingBus.arrival || "",
                duration: editingBus.duration || "",
                distance: Number(editingBus.distance) || 0,
                fare: editingBus.fare || {},
                totalSeats: Number(editingBus.totalSeats) || 0,
                availableSeats: Number(editingBus.availableSeats) || 0,
                amenities: editingBus.amenities || [],
                rating: Number(editingBus.rating) || 0,
                stops: stopsObject,
                on_which_day: editingBus.on_which_day || []
            };
            if (isAddingBus) {
                const response = await axios.post(`${API_URL}api/admin/buses`, {
                    busNo: editingBus.busNo.trim(),
                    ...busData
                }, {
                    withCredentials: true
                });
                const newBus = response.data.bus ||
                    response.data.createdBus ||
                {
                    busNo: editingBus.busNo.trim(),
                    ...busData
                };
                setBuses((prev) => [
                    newBus,
                    ...prev
                ]);
                alert("Bus added successfully");
            }
            else {
                const response = await axios.patch(`${API_URL}api/buses/${editingBus.busNo}`, busData, {
                    withCredentials: true
                });
                const updatedBus = response.data.bus ||
                    response.data.updatedBus ||
                {
                    ...editingBus,
                    ...busData
                };
                setBuses((prev) => prev.map((bus) => bus.busNo ===
                    editingBus.busNo
                    ? updatedBus
                    : bus));
                alert("Bus updated successfully");
            }
            setEditingBus(null);
            setIsAddingBus(false);
        }
        catch (error) {
            console.error(isAddingBus
                ? "Add bus error:"
                : "Update bus error:", error);
            alert(error.response?.data?.message ||
                (isAddingBus
                    ? "Failed to add bus"
                    : "Failed to update bus"));
        }
        finally {
            setSaving(false);
        }
    };
    return (<div className="admin-service-page">
        <div className="admin-service-header">
            <div>
                <h1>
                    🚌 Manage Buses
                </h1>
                <p>
                    View, add, edit and delete
                    bus services
                </p>
            </div>
            <div className="admin-header-actions">
                <button className="add-train-header-btn" onClick={handleAddBus}>
                    + Add Bus
                </button>
                <button className="dashboard-btn" onClick={() => navigate("/admin/dashboard")}>
                    ← Dashboard
                </button>
            </div>
        </div>
        <div className="admin-toolbar">
            <input type="text" placeholder="Search buses..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <span className="record-count">
                {filteredBuses.length} Buses
            </span>
        </div>
        {loading ? (<div className="admin-loading">
            Loading buses...
        </div>) : filteredBuses.length === 0 ? (<div className="admin-empty">
            No buses found.
        </div>) : (<div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>
                            Bus No
                        </th>
                        <th>
                            Bus Name
                        </th>
                        <th>
                            Operator
                        </th>
                        <th>
                            Type
                        </th>
                        <th>
                            From
                        </th>
                        <th>
                            To
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
                    {filteredBuses.map((bus) => (<tr key={bus.busNo}>
                        <td>
                            {bus.busNo}
                        </td>
                        <td>
                            {bus.busName}
                        </td>
                        <td>
                            {bus.operator}
                        </td>
                        <td>
                            {bus.busType}
                        </td>
                        <td>
                            {bus.source}
                        </td>
                        <td>
                            {bus.destination}
                        </td>
                        <td>
                            {bus.departure}
                        </td>
                        <td>
                            {bus.arrival}
                        </td>
                        <td>
                            <div className="action-buttons">
                                <button className="edit-btn" onClick={() => handleEdit(bus)}>
                                    Edit
                                </button>
                                <button className="delete-btn" onClick={() => handleDelete(bus.busNo)}>
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>))}
                </tbody>
            </table>
        </div>)}
        {editingBus && (<div className="edit-overlay">
            <form className="edit-modal" onSubmit={handleSave}>
                <div className="edit-modal-header">
                    <div>
                        <h2>
                            🚌{" "}
                            {isAddingBus
                                ? "Add Bus"
                                : "Edit Bus"}
                        </h2>
                        <p>
                            {isAddingBus
                                ? "Add a new bus service"
                                : "Update complete bus information"}
                        </p>
                    </div>
                    <button type="button" onClick={() => {
                        setEditingBus(null);
                        setIsAddingBus(false);
                    }}>
                        ×
                    </button>
                </div>
                <div className="bus-section">
                    <h3>
                        Basic Information
                    </h3>
                    <div className="edit-grid">
                        <label>
                            Bus Number
                            <input value={editingBus.busNo ||
                                ""} disabled={!isAddingBus} onChange={(e) => handleFieldChange("busNo", e.target.value)} placeholder="Enter bus number" />
                        </label>
                        <label>
                            Bus Name
                            <input value={editingBus.busName ||
                                ""} onChange={(e) => handleFieldChange("busName", e.target.value)} placeholder="Enter bus name" />
                        </label>
                        <label>
                            Operator
                            <input value={editingBus.operator ||
                                ""} onChange={(e) => handleFieldChange("operator", e.target.value)} placeholder="Enter operator" />
                        </label>
                        <label>
                            Bus Type
                            <input value={editingBus.busType ||
                                ""} onChange={(e) => handleFieldChange("busType", e.target.value)} placeholder="e.g. AC Sleeper" />
                        </label>
                        <label>
                            Source
                            <input value={editingBus.source ||
                                ""} onChange={(e) => handleFieldChange("source", e.target.value)} placeholder="Enter source" />
                        </label>
                        <label>
                            Destination
                            <input value={editingBus.destination ||
                                ""} onChange={(e) => handleFieldChange("destination", e.target.value)} placeholder="Enter destination" />
                        </label>
                        <label>
                            Departure
                            <input type="time" value={editingBus.departure ||
                                ""} onChange={(e) => handleFieldChange("departure", e.target.value)} />
                        </label>
                        <label>
                            Arrival
                            <input type="time" value={editingBus.arrival ||
                                ""} onChange={(e) => handleFieldChange("arrival", e.target.value)} />
                        </label>
                        <label>
                            Duration
                            <input value={editingBus.duration ||
                                ""} onChange={(e) => handleFieldChange("duration", e.target.value)} placeholder="e.g. 8h 30m" />
                        </label>
                        <label>
                            Distance
                            <input type="number" min="0" value={editingBus.distance ??
                                ""} onChange={(e) => handleFieldChange("distance", e.target.value)} />
                        </label>
                        <label>
                            Total Seats
                            <input type="number" min="0" value={editingBus.totalSeats ??
                                ""} onChange={(e) => handleFieldChange("totalSeats", e.target.value)} />
                        </label>
                        <label>
                            Available Seats
                            <input type="number" min="0" value={editingBus.availableSeats ??
                                ""} onChange={(e) => handleFieldChange("availableSeats", e.target.value)} />
                        </label>
                        <label>
                            Rating
                            <input type="number" min="0" max="5" step="0.1" value={editingBus.rating ??
                                ""} onChange={(e) => handleFieldChange("rating", e.target.value)} />
                        </label>
                    </div>
                </div>
                <div className="bus-section">
                    <h3>
                        Fare
                    </h3>
                    <div className="edit-grid">
                        {Object.entries(editingBus.fare || {}).map(([fareType, fare]) => (<label key={fareType}>
                            {fareType} Fare
                            <input type="number" min="0" value={fare ??
                                ""} onChange={(e) => handleFareChange(fareType, e.target.value)} />
                        </label>))}
                    </div>
                </div>
                <div className="bus-section">
                    <div className="section-title-row">
                        <div>
                            <h3>
                                Amenities
                            </h3>
                        </div>
                        <button type="button" className="add-item-btn" onClick={addAmenity}>
                            + Add Amenity
                        </button>
                    </div>
                    <div className="amenities-list">
                        {(editingBus.amenities ||
                            []).map((amenity, index) => (<div className="amenity-row" key={index}>
                                <input value={amenity} placeholder="Amenity" onChange={(e) => handleAmenityChange(index, e.target.value)} />
                                <button type="button" className="remove-item-btn" onClick={() => removeAmenity(index)}>
                                    Remove
                                </button>
                            </div>))}
                    </div>
                </div>
                <div className="bus-section">
                    <div className="section-title-row">
                        <div>
                            <h3>
                                Intermediate Stops
                            </h3>
                            <p>
                                Manage station,
                                arrival,
                                departure and
                                distance.
                            </p>
                        </div>
                        <button type="button" className="add-item-btn" onClick={addStop}>
                            + Add Stop
                        </button>
                    </div>
                    {editingBus.stops.length ===
                        0 ? (<div className="no-stops">
                            No stops added.
                        </div>) : (<div className="stops-container">
                            {editingBus.stops.map((stop, index) => (<div className="stop-card" key={index}>
                                <div className="stop-card-header">
                                    <strong>
                                        Stop{" "}
                                        {index +
                                            1}
                                    </strong>
                                    <button type="button" className="remove-item-btn" onClick={() => removeStop(index)}>
                                        Remove
                                    </button>
                                </div>
                                <div className="edit-grid">
                                    <label>
                                        Station
                                        <input value={stop.station ??
                                            ""} onChange={(e) => handleStopChange(index, "station", e.target.value)} />
                                    </label>
                                    <label>
                                        Arrival
                                        <input value={stop.arrival ??
                                            ""} onChange={(e) => handleStopChange(index, "arrival", e.target.value)} />
                                    </label>
                                    <label>
                                        Departure
                                        <input value={stop.departure ??
                                            ""} onChange={(e) => handleStopChange(index, "departure", e.target.value)} />
                                    </label>
                                    <label>
                                        Distance
                                        <input type="number" min="0" value={stop.distance ??
                                            ""} onChange={(e) => handleStopChange(index, "distance", Number(e.target.value))} />
                                    </label>
                                </div>
                            </div>))}
                        </div>)}
                </div>
                <div className="bus-section">
                    <h3>
                        Operating Days
                    </h3>
                    <div className="days-container">
                        {[
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun"
                        ].map((day) => (<label className="day-checkbox" key={day}>
                            <input type="checkbox" checked={(editingBus.on_which_day ||
                                []).includes(day)} onChange={() => toggleDay(day)} />
                            <span>
                                {day}
                            </span>
                        </label>))}
                    </div>
                </div>
                <div className="modal-actions">
                    <button type="button" className="cancel-btn" onClick={() => {
                        setEditingBus(null);
                        setIsAddingBus(false);
                    }} disabled={saving}>
                        Cancel
                    </button>
                    <button type="submit" className="save-btn" disabled={saving}>
                        {saving
                            ? "Saving..."
                            : isAddingBus
                                ? "Add Bus"
                                : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>)}
    </div>);
};
export default AdminBuses;