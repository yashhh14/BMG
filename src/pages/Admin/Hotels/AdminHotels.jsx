import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdmin } from "../../../context/AdminContext";
import "./AdminHotels.css";
const API_URL = import.meta.env.VITE_API_URL;
const AdminHotels = () => {
    const navigate = useNavigate();
    const {
        hotels,
        loading,
        setHotels
    } = useAdmin();
    const [search, setSearch] = useState("");
    const [editingHotel, setEditingHotel] = useState(null);
    const [isAddingHotel, setIsAddingHotel] = useState(false);
    const [saving, setSaving] = useState(false);
    const filteredHotels = hotels.filter((hotel) => {
        const value = search.toLowerCase();
        return (
            String(hotel.hotelId || "")
                .toLowerCase()
                .includes(value) ||
            String(hotel.name || "")
                .toLowerCase()
                .includes(value) ||
            String(hotel.city || "")
                .toLowerCase()
                .includes(value) ||
            String(hotel.area || "")
                .toLowerCase()
                .includes(value)
        );
    });
    const handleAddHotel = () => {
        setIsAddingHotel(true);
        setEditingHotel({
            hotelId: "",
            name: "",
            city: "",
            area: "",
            stars: 0,
            rating: 0,
            rooms: {},
            checkIn: "",
            checkOut: ""
        });
    };
    const handleDelete = async (hotelId) => {
        if (
            !window.confirm(
                `Delete hotel ${hotelId}?`
            )
        ) {
            return;
        }
        try {
            await axios.delete(
                `${API_URL}api/hotels/${hotelId}`,
                {
                    withCredentials: true
                }
            );
            setHotels((prev) =>
                prev.filter(
                    (hotel) =>
                        hotel.hotelId !== hotelId
                )
            );
            alert(
                "Hotel deleted successfully"
            );
        } catch (error) {
            console.error(
                "Delete hotel error:",
                error
            );
            alert(
                error.response?.data?.message ||
                "Failed to delete hotel"
            );
        }
    };
    const handleSaveHotel = async (e) => {
        e.preventDefault();
        if (
            !editingHotel?.hotelId ||
            !editingHotel?.name ||
            !editingHotel?.city
        ) {
            alert(
                "Hotel ID, Name and City are required"
            );
            return;
        }
        try {
            setSaving(true);
            if (isAddingHotel) {
                const response = await axios.post(
                    `${API_URL}api/admin/hotels`,
                    {
                        hotelId:
                            editingHotel.hotelId,
                        name:
                            editingHotel.name,
                        city:
                            editingHotel.city,
                        area:
                            editingHotel.area,
                        stars:
                            Number(
                                editingHotel.stars
                            ) || 0,
                        rating:
                            Number(
                                editingHotel.rating
                            ) || 0,
                        rooms:
                            editingHotel.rooms || {},
                        checkIn:
                            editingHotel.checkIn,
                        checkOut:
                            editingHotel.checkOut
                    },
                    {
                        withCredentials: true
                    }
                );
                const newHotel =
                    response.data.hotel ||
                    response.data.newHotel ||
                    editingHotel;
                setHotels((prev) => [
                    ...prev,
                    newHotel
                ]);
                alert(
                    "Hotel added successfully"
                );
            }
            else {
                const response = await axios.patch(
                    `${API_URL}api/hotels/${editingHotel.hotelId}`,
                    {
                        name:
                            editingHotel.name,
                        city:
                            editingHotel.city,
                        area:
                            editingHotel.area,
                        stars:
                            Number(
                                editingHotel.stars
                            ) || 0,
                        rating:
                            Number(
                                editingHotel.rating
                            ) || 0,
                        rooms:
                            editingHotel.rooms,
                        checkIn:
                            editingHotel.checkIn,
                        checkOut:
                            editingHotel.checkOut
                    },
                    {
                        withCredentials: true
                    }
                );
                const updated =
                    response.data.hotel ||
                    response.data.updatedHotel ||
                    editingHotel;
                setHotels((prev) =>
                    prev.map((hotel) =>
                        hotel.hotelId ===
                            editingHotel.hotelId
                            ? {
                                ...hotel,
                                ...updated
                            }
                            : hotel
                    )
                );
                alert(
                    "Hotel updated successfully"
                );
            }
            setEditingHotel(null);
            setIsAddingHotel(false);
        } catch (error) {
            console.error(
                "Hotel save error:",
                error
            );
            alert(
                error.response?.data?.message ||
                "Failed to save hotel"
            );
        } finally {
            setSaving(false);
        }
    };
    const closeModal = () => {
        if (saving) {
            return;
        }
        setEditingHotel(null);
        setIsAddingHotel(false);
    };
    return (
        <div className="admin-service-page">
            <div className="admin-service-header">
                <div>
                    <h1>
                        🏨 Manage Hotels
                    </h1>
                    <p>
                        View, add, edit and delete hotel services
                    </p>
                </div>
                <div className="admin-header-actions">
                    <button
                        className="add-train-header-btn"
                        onClick={handleAddHotel}
                    >
                        + Add Hotel
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
            <div className="admin-toolbar">
                <input
                    type="text"
                    placeholder="Search hotels..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />
                <span className="record-count">
                    {filteredHotels.length} Hotels
                </span>
            </div>
            {loading ? (
                <div className="admin-loading">
                    Loading hotels...
                </div>
            )
                : filteredHotels.length === 0 ? (
                    <div className="admin-empty">
                        No hotels found.
                    </div>
                )
                    : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>
                                            Hotel ID
                                        </th>
                                        <th>
                                            Name
                                        </th>
                                        <th>
                                            City
                                        </th>
                                        <th>
                                            Area
                                        </th>
                                        <th>
                                            Stars
                                        </th>
                                        <th>
                                            Rating
                                        </th>
                                        <th>
                                            Rooms
                                        </th>
                                        <th>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHotels.map(
                                        (hotel) => (
                                            <tr
                                                key={
                                                    hotel.hotelId
                                                }
                                            >
                                                <td>
                                                    {
                                                        hotel.hotelId
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        hotel.name
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        hotel.city
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        hotel.area
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        hotel.stars
                                                    }{" "}
                                                    ⭐
                                                </td>
                                                <td>
                                                    {
                                                        hotel.rating
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        hotel.rooms &&
                                                            typeof hotel.rooms ===
                                                            "object"
                                                            ? Object.keys(
                                                                hotel.rooms
                                                            ).length
                                                            : hotel.rooms ||
                                                            0
                                                    }
                                                </td>
                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => {
                                                                setIsAddingHotel(
                                                                    false
                                                                );
                                                                setEditingHotel(
                                                                    {
                                                                        ...hotel
                                                                    }
                                                                );
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    hotel.hotelId
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
            {editingHotel && (
                <div className="edit-overlay">
                    <form
                        className="edit-modal"
                        onSubmit={
                            handleSaveHotel
                        }
                    >
                        <div className="edit-modal-header">
                            <div>
                                <h2>
                                    {
                                        isAddingHotel
                                            ? "Add Hotel"
                                            : "Edit Hotel"
                                    }
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={
                                    closeModal
                                }
                                disabled={saving}
                            >
                                ×
                            </button>
                        </div>
                        <div className="edit-grid">
                            <label>
                                Hotel ID
                                <input
                                    value={
                                        editingHotel.hotelId ||
                                        ""
                                    }
                                    disabled={
                                        !isAddingHotel
                                    }
                                    onChange={(e) =>
                                        setEditingHotel({
                                            ...editingHotel,
                                            hotelId:
                                                e.target.value
                                        })
                                    }
                                    placeholder="Enter hotel ID"
                                />
                            </label>
                            <label>
                                Hotel Name
                                <input
                                    value={
                                        editingHotel.name ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingHotel({
                                            ...editingHotel,
                                            name:
                                                e.target.value
                                        })
                                    }
                                    placeholder="Enter hotel name"
                                />
                            </label>
                            <label>
                                City
                                <input
                                    value={
                                        editingHotel.city ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingHotel({
                                            ...editingHotel,
                                            city:
                                                e.target.value
                                        })
                                    }
                                    placeholder="Enter city"
                                />
                            </label>
                            <label>
                                Area
                                <input
                                    value={
                                        editingHotel.area ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingHotel({
                                            ...editingHotel,
                                            area:
                                                e.target.value
                                        })
                                    }
                                    placeholder="Enter area"
                                />
                            </label>
                            <label>
                                Stars
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    value={
                                        editingHotel.stars ??
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingHotel({
                                            ...editingHotel,
                                            stars:
                                                e.target.value
                                        })
                                    }
                                    placeholder="0 - 5"
                                />
                            </label>
                            <label>
                                Rating
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    value={
                                        editingHotel.rating ??
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingHotel({
                                            ...editingHotel,
                                            rating:
                                                e.target.value
                                        })
                                    }
                                    placeholder="0 - 5"
                                />
                            </label>
                            <label>
                                Rooms
                                <input
                                    type="text"
                                    value={
                                        typeof editingHotel.rooms ===
                                            "object"
                                            ? JSON.stringify(
                                                editingHotel.rooms
                                            )
                                            : editingHotel.rooms ||
                                            ""
                                    }
                                    onChange={(e) => {
                                        try {
                                            const value =
                                                JSON.parse(
                                                    e.target.value
                                                );
                                            setEditingHotel({
                                                ...editingHotel,
                                                rooms: value
                                            });
                                        } catch {
                                            setEditingHotel({
                                                ...editingHotel,
                                                rooms:
                                                    e.target.value
                                            });
                                        }
                                    }}
                                    placeholder='{"Standard": 10, "Deluxe": 5}'
                                />
                            </label>
                            <label>
                                Check In
                                <input
                                    value={
                                        editingHotel.checkIn ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingHotel({
                                            ...editingHotel,
                                            checkIn:
                                                e.target.value
                                        })
                                    }
                                    placeholder="e.g. 12:00 PM"
                                />
                            </label>
                            <label>
                                Check Out
                                <input
                                    value={
                                        editingHotel.checkOut ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingHotel({
                                            ...editingHotel,
                                            checkOut:
                                                e.target.value
                                        })
                                    }
                                    placeholder="e.g. 11:00 AM"
                                />
                            </label>
                        </div>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={
                                    closeModal
                                }
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="save-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : isAddingHotel
                                        ? "Add Hotel"
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
export default AdminHotels;