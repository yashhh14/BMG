import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdmin } from "../../../context/AdminContext";
import "./AdminCabs.css";
const API_URL = import.meta.env.VITE_API_URL;
const AdminCabs = () => {
    const navigate = useNavigate();
    const {
        cabs,
        loading,
        setCabs
    } = useAdmin();
    const [search, setSearch] = useState("");
    const [editingCab, setEditingCab] = useState(null);
    const [isAddingCab, setIsAddingCab] = useState(false);
    const [saving, setSaving] = useState(false);
    const filteredCabs = cabs.filter((cab) => {
        const value = search.toLowerCase();
        return (
            String(cab.cabId || "")
                .toLowerCase()
                .includes(value) ||
            String(cab.operator || "")
                .toLowerCase()
                .includes(value) ||
            String(cab.carModel || "")
                .toLowerCase()
                .includes(value) ||
            String(cab.city || "")
                .toLowerCase()
                .includes(value)
        );
    });
    const handleAddCab = () => {
        setIsAddingCab(true);
        setEditingCab({
            cabId: "",
            operator: "",
            cabType: "",
            carModel: "",
            city: "",
            driverName: "",
            rating: 0,
            baseFare: 0,
            farePerKm: 0,
            capacity: 4,
            status: "available"
        });
    };
    const handleDelete = async (cabId) => {
        if (
            !window.confirm(
                `Delete cab ${cabId}?`
            )
        ) {
            return;
        }
        try {
            await axios.delete(
                `${API_URL}api/cabs/${cabId}`,
                {
                    withCredentials: true
                }
            );
            setCabs((prev) =>
                prev.filter(
                    (cab) =>
                        cab.cabId !== cabId
                )
            );
            alert(
                "Cab deleted successfully"
            );
        } catch (error) {
            console.error(
                "Delete cab error:",
                error
            );
            alert(
                error.response?.data?.message ||
                "Failed to delete cab"
            );
        }
    };
    const handleSaveCab = async (e) => {
        e.preventDefault();
        if (
            !editingCab?.cabId ||
            !editingCab?.operator ||
            !editingCab?.cabType ||
            !editingCab?.carModel ||
            !editingCab?.city
        ) {
            alert(
                "Cab ID, Operator, Cab Type, Car Model and City are required."
            );
            return;
        }
        try {
            setSaving(true);
            if (isAddingCab) {
                const response = await axios.post(
                    `${API_URL}api/admin/cabs`,
                    {
                        cabId:
                            editingCab.cabId.trim(),
                        operator:
                            editingCab.operator.trim(),
                        cabType:
                            editingCab.cabType.trim(),
                        carModel:
                            editingCab.carModel.trim(),
                        city:
                            editingCab.city.trim(),
                        driverName:
                            editingCab.driverName?.trim(),
                        rating:
                            Number(
                                editingCab.rating
                            ) || 0,
                        baseFare:
                            Number(
                                editingCab.baseFare
                            ) || 0,
                        farePerKm:
                            Number(
                                editingCab.farePerKm
                            ) || 0,
                        capacity:
                            Number(
                                editingCab.capacity
                            ) || 0,
                        status:
                            editingCab.status ||
                            "available"
                    },
                    {
                        withCredentials: true
                    }
                );
                const newCab =
                    response.data.cab ||
                    response.data.newCab ||
                    editingCab;
                setCabs((prev) => [
                    ...prev,
                    newCab
                ]);
                alert(
                    "Cab added successfully"
                );
            }
            else {
                const response = await axios.patch(
                    `${API_URL}api/cabs/${editingCab.cabId}`,
                    {
                        operator:
                            editingCab.operator,
                        cabType:
                            editingCab.cabType,
                        carModel:
                            editingCab.carModel,
                        city:
                            editingCab.city,
                        driverName:
                            editingCab.driverName,
                        rating:
                            Number(
                                editingCab.rating
                            ) || 0,
                        baseFare:
                            Number(
                                editingCab.baseFare
                            ) || 0,
                        farePerKm:
                            Number(
                                editingCab.farePerKm
                            ) || 0,
                        capacity:
                            Number(
                                editingCab.capacity
                            ) || 0,
                        status:
                            editingCab.status
                    },
                    {
                        withCredentials: true
                    }
                );
                const updated =
                    response.data.cab ||
                    response.data.updatedCab ||
                    editingCab;
                setCabs((prev) =>
                    prev.map((cab) =>
                        cab.cabId ===
                            editingCab.cabId
                            ? {
                                ...cab,
                                ...updated
                            }
                            : cab
                    )
                );
                alert(
                    "Cab updated successfully"
                );
            }
            setEditingCab(null);
            setIsAddingCab(false);
        } catch (error) {
            console.error(
                "Save cab error:",
                error
            );
            alert(
                error.response?.data?.message ||
                "Failed to save cab"
            );
        } finally {
            setSaving(false);
        }
    };
    const closeModal = () => {
        if (saving) {
            return;
        }
        setEditingCab(null);
        setIsAddingCab(false);
    };
    return (
        <div className="admin-service-page">
            <div className="admin-service-header">
                <div>
                    <h1>
                        🚕 Manage Cabs
                    </h1>
                    <p>
                        View, add, edit and delete cab services
                    </p>
                </div>
                <div className="admin-header-actions">
                    <button
                        className="add-train-header-btn"
                        onClick={handleAddCab}
                    >
                        + Add Cab
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
                    placeholder="Search cabs..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                />
                <span className="record-count">
                    {filteredCabs.length} Cabs
                </span>
            </div>
            {loading ? (
                <div className="admin-loading">
                    Loading cabs...
                </div>
            ) : filteredCabs.length === 0 ? (
                <div className="admin-empty">
                    No cabs found.
                </div>
            ) : (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>
                                    Cab ID
                                </th>
                                <th>
                                    Operator
                                </th>
                                <th>
                                    Car
                                </th>
                                <th>
                                    Type
                                </th>
                                <th>
                                    City
                                </th>
                                <th>
                                    Driver
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCabs.map(
                                (cab) => (
                                    <tr
                                        key={
                                            cab.cabId
                                        }
                                    >
                                        <td>
                                            {
                                                cab.cabId
                                            }
                                        </td>
                                        <td>
                                            {
                                                cab.operator
                                            }
                                        </td>
                                        <td>
                                            {
                                                cab.carModel
                                            }
                                        </td>
                                        <td>
                                            {
                                                cab.cabType
                                            }
                                        </td>
                                        <td>
                                            {
                                                cab.city
                                            }
                                        </td>
                                        <td>
                                            {
                                                cab.driverName
                                            }
                                        </td>
                                        <td>
                                            <span
                                                className={
                                                    cab.status ===
                                                        "available"
                                                        ? "status-available"
                                                        : "status-unavailable"
                                                }
                                            >
                                                {
                                                    cab.status
                                                }
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="edit-btn"
                                                    onClick={() => {
                                                        setIsAddingCab(
                                                            false
                                                        );
                                                        setEditingCab(
                                                            JSON.parse(
                                                                JSON.stringify(
                                                                    cab
                                                                )
                                                            )
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            cab.cabId
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
            {editingCab && (
                <div className="edit-overlay">
                    <form
                        className="edit-modal"
                        onSubmit={
                            handleSaveCab
                        }
                    >
                        <div className="edit-modal-header">
                            <div>
                                <h2>
                                    {isAddingCab
                                        ? "Add Cab"
                                        : "Edit Cab"
                                    }
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                            >
                                ×
                            </button>
                        </div>
                        <div className="edit-grid">
                            <label>
                                Cab ID
                                <input
                                    value={
                                        editingCab.cabId ||
                                        ""
                                    }
                                    disabled={
                                        !isAddingCab
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            cabId:
                                                e.target.value
                                        })
                                    }
                                    placeholder="Enter cab ID"
                                />
                            </label>
                            <label>
                                Operator
                                <input
                                    value={
                                        editingCab.operator ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            operator:
                                                e.target.value
                                        })
                                    }
                                    placeholder="e.g. Uber"
                                />
                            </label>
                            <label>
                                Cab Type
                                <input
                                    value={
                                        editingCab.cabType ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            cabType:
                                                e.target.value
                                        })
                                    }
                                    placeholder="e.g. Sedan"
                                />
                            </label>
                            <label>
                                Car Model
                                <input
                                    value={
                                        editingCab.carModel ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            carModel:
                                                e.target.value
                                        })
                                    }
                                    placeholder="e.g. Dzire"
                                />
                            </label>
                            <label>
                                City
                                <input
                                    value={
                                        editingCab.city ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            city:
                                                e.target.value
                                        })
                                    }
                                    placeholder="e.g. Hyderabad"
                                />
                            </label>
                            <label>
                                Driver Name
                                <input
                                    value={
                                        editingCab.driverName ||
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            driverName:
                                                e.target.value
                                        })
                                    }
                                    placeholder="Driver name"
                                />
                            </label>
                            <label>
                                Rating
                                <input
                                    type="number"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    value={
                                        editingCab.rating ??
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            rating:
                                                e.target.value
                                        })
                                    }
                                    placeholder="0 - 5"
                                />
                            </label>
                            <label>
                                Base Fare
                                <input
                                    type="number"
                                    min="0"
                                    value={
                                        editingCab.baseFare ??
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            baseFare:
                                                e.target.value
                                        })
                                    }
                                    placeholder="e.g. 200"
                                />
                            </label>
                            <label>
                                Fare / KM
                                <input
                                    type="number"
                                    min="0"
                                    step="0.1"
                                    value={
                                        editingCab.farePerKm ??
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            farePerKm:
                                                e.target.value
                                        })
                                    }
                                    placeholder="e.g. 15"
                                />
                            </label>
                            <label>
                                Capacity
                                <input
                                    type="number"
                                    min="1"
                                    value={
                                        editingCab.capacity ??
                                        ""
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            capacity:
                                                e.target.value
                                        })
                                    }
                                    placeholder="e.g. 4"
                                />
                            </label>
                            <label>
                                Status
                                <select
                                    value={
                                        editingCab.status ||
                                        "available"
                                    }
                                    onChange={(e) =>
                                        setEditingCab({
                                            ...editingCab,
                                            status:
                                                e.target.value
                                        })
                                    }
                                >
                                    <option value="available">
                                        Available
                                    </option>
                                    <option value="unavailable">
                                        Unavailable
                                    </option>
                                </select>
                            </label>
                        </div>
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={closeModal}
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
                                    : isAddingCab
                                        ? "Add Cab"
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
export default AdminCabs;