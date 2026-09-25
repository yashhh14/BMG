import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAdmin } from "../../../context/AdminContext";
import "./AdminTrains.css";
import PageLoader from "../../../components/PageLoader/PageLoader";
const API_URL = import.meta.env.VITE_API_URL;
const AdminTrains = () => {
    const navigate = useNavigate();
    const { trains, setTrains, trainTotal, trainResultTotal, trainPage, trainTotalPages, searchTrains, setTrainResultTotal, fetchTrainCount, loading: adminLoading } = useAdmin();
    const [loading, setLoading] = useState(true);
    const [searchFilters, setSearchFilters] = useState({ trainNo: "", trainName: "", source: "", destination: "" });
    const [searched, setSearched] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [editingTrain, setEditingTrain] = useState(null);
    const [isAddingTrain, setIsAddingTrain] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loadingTrain, setLoadingTrain] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, []);
    const hasSearchFilters =
        Object.values(searchFilters).some(
            (value) =>
                value.trim() !== ""
        );
    const handleSearchChange = (
        field,
        value
    ) => {
        setSearchFilters((prev) => ({
            ...prev,
            [field]: value
        }));
    };
    const handleSearch = async () => {
        if (!hasSearchFilters) {
            setTrains([]);
            setTrainResultTotal(0);
            setSearched(false);
            return;
        }
        try {
            setSearchLoading(true);
            setSearched(true);
            await searchTrains(
                searchFilters,
                1
            );
        } catch (error) {
            console.error(
                "Train search error:",
                error
            );
        } finally {
            setSearchLoading(false);
        }
    };
    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };
    const handleClearSearch = () => {
        setSearchFilters({
            trainNo: "",
            trainName: "",
            source: "",
            destination: ""
        });
        setTrains([]);
        setTrainResultTotal(0);
        setSearched(false);
    };
    const handleDelete = async (
        trainNo
    ) => {
        const confirmDelete =
            window.confirm(
                `Are you sure you want to delete train ${trainNo}?`
            );
        if (!confirmDelete) {
            return;
        }
        try {
            await axios.delete(
                `${API_URL}api/trains/${trainNo}`,
                {
                    withCredentials: true
                }
            );
            await fetchTrainCount();
            if (hasSearchFilters) {
                await searchTrains(
                    searchFilters,
                    trainPage
                );
            } else {
                setTrains([]);
                setTrainResultTotal(0);
                setSearched(false);
            }
            alert(
                "Train deleted successfully"
            );
        } catch (error) {
            console.error(
                "Delete train error:",
                error
            );
            alert(
                error.response?.data?.message ||
                "Failed to delete train"
            );
        }
    };
    const handleEdit = async (
        trainNo
    ) => {
        try {
            setLoadingTrain(true);
            const response =
                await axios.get(
                    `${API_URL}api/admin/trains/${trainNo}`,
                    {
                        withCredentials: true
                    }
                );
            const train =
                response.data.train;
            if (!train) {
                alert(
                    "Train not found"
                );
                return;
            }
            if (
                train.stops &&
                typeof train.stops === "object" &&
                !Array.isArray(train.stops)
            ) {
                train.stops =
                    Object.keys(
                        train.stops
                    )
                        .sort(
                            (a, b) =>
                                Number(a) -
                                Number(b)
                        )
                        .map((key) => {
                            const stop =
                                train.stops[key] ||
                                {};
                            return {
                                station:
                                    stop.station ??
                                    "",
                                arrival:
                                    stop.arrival ??
                                    "",
                                departure:
                                    stop.departure ??
                                    "",
                                day:
                                    Number(
                                        stop.day ??
                                        1
                                    ),
                                distance:
                                    Number(
                                        stop.distance ??
                                        0
                                    ),
                                halt:
                                    Number(
                                        stop.halt ??
                                        0
                                    ),
                                platform:
                                    Number(
                                        stop.platform ??
                                        0
                                    )
                            };
                        });
            } else {
                train.stops = [];
            }
            train.classes =
                train.classes &&
                    typeof train.classes === "object"
                    ? train.classes
                    : {};
            train.seatAvailability =
                train.seatAvailability &&
                    typeof train.seatAvailability ===
                    "object"
                    ? train.seatAvailability
                    : {};
            train.on_which_day =
                Array.isArray(
                    train.on_which_day
                )
                    ? train.on_which_day
                    : [];
            setIsAddingTrain(false);
            setEditingTrain(train);
        } catch (error) {
            console.error(
                "Failed to load train:",
                error
            );
            alert(
                error.response?.data?.message ||
                "Failed to load train"
            );
        } finally {
            setLoadingTrain(false);
        }
    };
    const handleAddTrain = () => {
        setIsAddingTrain(true);
        setEditingTrain({
            trainNo: "",
            trainName: "",
            source: "",
            destination: "",
            departure: "",
            arrival: "",
            duration: "",
            distance: 0,
            classes: {
                SL: 0,
                "3A": 0,
                "2A": 0,
                "1A": 0
            },
            seatAvailability: {
                SL: 0,
                "3A": 0,
                "2A": 0,
                "1A": 0
            },
            stops: [],
            on_which_day: []
        });
    };
    const handleFieldChange = (
        field,
        value
    ) => {
        setEditingTrain((prev) => ({
            ...prev,
            [field]: value
        }));
    };
    const handleStopChange = (
        index,
        field,
        value
    ) => {
        setEditingTrain((prev) => {
            const updatedStops = [
                ...(prev.stops || [])
            ];
            updatedStops[index] = {
                ...updatedStops[index],
                [field]: value
            };
            return {
                ...prev,
                stops: updatedStops
            };
        });
    };
    const addStop = () => {
        setEditingTrain((prev) => ({
            ...prev,
            stops: [
                ...(prev.stops || []),
                {
                    station: "",
                    arrival: "",
                    departure: "",
                    day: 1,
                    distance: 0,
                    halt: 0,
                    platform: 0
                }
            ]
        }));
    };
    const removeStop = (
        index
    ) => {
        setEditingTrain((prev) => ({
            ...prev,
            stops: (
                prev.stops || []
            ).filter(
                (_, i) =>
                    i !== index
            )
        }));
    };
    const handleSeatAvailabilityChange = (
        className,
        value
    ) => {
        setEditingTrain((prev) => ({
            ...prev,
            seatAvailability: {
                ...(prev.seatAvailability || {}),
                [className]:
                    Number(value)
            }
        }));
    };
    const handleClassChange = (
        className,
        value
    ) => {
        setEditingTrain((prev) => ({
            ...prev,
            classes: {
                ...(prev.classes || {}),
                [className]:
                    Number(value)
            }
        }));
    };
    const toggleDay = (
        day
    ) => {
        setEditingTrain((prev) => {
            const currentDays =
                prev.on_which_day ||
                [];
            const exists =
                currentDays.includes(day);
            return {
                ...prev,
                on_which_day:
                    exists
                        ? currentDays.filter(
                            (item) =>
                                item !== day
                        )
                        : [
                            ...currentDays,
                            day
                        ]
            };
        });
    };
    const handleSave = async (
        e
    ) => {
        e.preventDefault();
        if (!editingTrain) {
            return;
        }
        try {
            setSaving(true);
            if (
                !editingTrain.trainNo?.trim()
            ) {
                alert(
                    "Please enter train number."
                );
                return;
            }
            if (
                !editingTrain.trainName?.trim()
            ) {
                alert(
                    "Please enter train name."
                );
                return;
            }
            if (
                !editingTrain.source?.trim()
            ) {
                alert(
                    "Please enter source."
                );
                return;
            }
            if (
                !editingTrain.destination?.trim()
            ) {
                alert(
                    "Please enter destination."
                );
                return;
            }
            const stops =
                editingTrain.stops ||
                [];
            const invalidStopIndex =
                stops.findIndex(
                    (stop) =>
                        !stop ||
                        !stop.station ||
                        !String(
                            stop.station
                        ).trim()
                );
            if (
                invalidStopIndex !== -1
            ) {
                alert(
                    `Please enter the station name for Stop ${invalidStopIndex + 1
                    }.`
                );
                return;
            }
            const stopsObject = {};
            stops.forEach(
                (
                    stop,
                    index
                ) => {
                    stopsObject[index] = {
                        station:
                            String(
                                stop.station
                            ).trim(),
                        arrival:
                            stop.arrival
                                ? String(
                                    stop.arrival
                                ).trim()
                                : "",
                        departure:
                            stop.departure
                                ? String(
                                    stop.departure
                                ).trim()
                                : "",
                        day:
                            Number(
                                stop.day || 1
                            ),
                        distance:
                            Number(
                                stop.distance || 0
                            ),
                        halt:
                            Number(
                                stop.halt || 0
                            ),
                        platform:
                            Number(
                                stop.platform || 0
                            )
                    };
                }
            );
            const trainData = {
                trainNo:
                    String(
                        editingTrain.trainNo
                    ).trim(),
                trainName:
                    String(
                        editingTrain.trainName
                    ).trim(),
                source:
                    String(
                        editingTrain.source
                    ).trim(),
                destination:
                    String(
                        editingTrain.destination
                    ).trim(),
                departure:
                    String(
                        editingTrain.departure ||
                        ""
                    ).trim(),
                arrival:
                    String(
                        editingTrain.arrival ||
                        ""
                    ).trim(),
                duration:
                    String(
                        editingTrain.duration ||
                        ""
                    ).trim(),
                distance:
                    Number(
                        editingTrain.distance ||
                        0
                    ),
                classes:
                    editingTrain.classes ||
                    {},
                seatAvailability:
                    editingTrain.seatAvailability ||
                    {},
                stops:
                    stopsObject,
                on_which_day:
                    editingTrain.on_which_day ||
                    []
            };
            if (isAddingTrain) {
                await axios.post(
                    `${API_URL}api/admin/trains`,
                    trainData,
                    {
                        withCredentials: true
                    }
                );
                await fetchTrainCount();
                if (hasSearchFilters) {
                    await searchTrains(
                        searchFilters,
                        1
                    );
                } else {
                    setTrains([]);
                    setTrainResultTotal(0);
                    setSearched(false);
                }
                setEditingTrain(null);
                setIsAddingTrain(false);
                alert(
                    "Train added successfully"
                );
                return;
            }
            const updatedTrainData = {
                trainName:
                    trainData.trainName,
                source:
                    trainData.source,
                destination:
                    trainData.destination,
                departure:
                    trainData.departure,
                arrival:
                    trainData.arrival,
                duration:
                    trainData.duration,
                distance:
                    trainData.distance,
                classes:
                    trainData.classes,
                seatAvailability:
                    trainData.seatAvailability,
                stops:
                    trainData.stops,
                on_which_day:
                    trainData.on_which_day
            };
            await axios.patch(
                `${API_URL}api/trains/${editingTrain.trainNo}`,
                updatedTrainData,
                {
                    withCredentials: true
                }
            );
            if (hasSearchFilters) {
                await searchTrains(
                    searchFilters,
                    trainPage
                );
            }
            setEditingTrain(null);
            setIsAddingTrain(false);
            alert(
                "Train updated successfully"
            );
        } catch (error) {
            console.error(
                "Save train error:",
                error
            );
            alert(
                error.response?.data?.message ||
                "Failed to save train"
            );
        } finally {
            setSaving(false);
        }
    };
    const changePage = async (
        page
    ) => {
        if (
            !hasSearchFilters ||
            page < 1 ||
            page > trainTotalPages ||
            page === trainPage
        ) {
            return;
        }
        try {
            setSearchLoading(true);
            await searchTrains(
                searchFilters,
                page
            );
        } catch (error) {
            console.error(
                "Train pagination error:",
                error
            );
        } finally {
            setSearchLoading(false);
        }
    };
    const closeModal = () => {
        if (saving) {
            return;
        }
        setEditingTrain(null);
        setIsAddingTrain(false);
    };
    return (
        <div className="admin-service-page">
            {loading && (
                <PageLoader
                    type="adminTrain"
                />
            )}
            <div className="admin-service-header">
                <div>
                    <h1>
                        🚆 Manage Trains
                    </h1>
                    <p>
                        View, add, edit and delete
                        train services
                    </p>
                </div>
                <div className="admin-header-actions">
                    <button
                        type="button"
                        className="add-train-header-btn"
                        onClick={handleAddTrain}
                    >
                        + Add Train
                    </button>
                    <button
                        type="button"
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
            <div className="train-search-panel">
                <div className="train-search-fields">
                    <div className="train-search-field">
                        <label htmlFor="trainNo">
                            Train Number
                        </label>
                        <input
                            id="trainNo"
                            type="text"
                            placeholder="e.g. 07029"
                            value={
                                searchFilters.trainNo
                            }
                            onChange={(e) =>
                                handleSearchChange(
                                    "trainNo",
                                    e.target.value
                                )
                            }
                            onKeyDown={
                                handleSearchKeyDown
                            }
                        />
                    </div>
                    <div className="train-search-field">
                        <label htmlFor="trainName">
                            Train Name
                        </label>
                        <input
                            id="trainName"
                            type="text"
                            placeholder="e.g. Rajdhani Express"
                            value={
                                searchFilters.trainName
                            }
                            onChange={(e) =>
                                handleSearchChange(
                                    "trainName",
                                    e.target.value
                                )
                            }
                            onKeyDown={
                                handleSearchKeyDown
                            }
                        />
                    </div>
                    <div className="train-search-field">
                        <label htmlFor="trainSource">
                            Source
                        </label>
                        <input
                            id="trainSource"
                            type="text"
                            placeholder="e.g. Hyderabad"
                            value={
                                searchFilters.source
                            }
                            onChange={(e) =>
                                handleSearchChange(
                                    "source",
                                    e.target.value
                                )
                            }
                            onKeyDown={
                                handleSearchKeyDown
                            }
                        />
                    </div>
                    <div className="train-search-field">
                        <label htmlFor="trainDestination">
                            Destination
                        </label>
                        <input
                            id="trainDestination"
                            type="text"
                            placeholder="e.g. Delhi"
                            value={
                                searchFilters.destination
                            }
                            onChange={(e) =>
                                handleSearchChange(
                                    "destination",
                                    e.target.value
                                )
                            }
                            onKeyDown={
                                handleSearchKeyDown
                            }
                        />
                    </div>
                </div>
                <div className="train-search-actions">
                    <div className="train-search-buttons">
                        <button
                            type="button"
                            className="train-search-btn"
                            onClick={handleSearch}
                            disabled={searchLoading}
                        >
                            {searchLoading
                                ? "Searching..."
                                : "Search Trains"}
                        </button>
                        {searched && (
                            <button
                                type="button"
                                className="train-clear-btn"
                                onClick={
                                    handleClearSearch
                                }
                                disabled={searchLoading}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    <span className="record-count">
                        {searched
                            ? `${(
                                trainResultTotal ||
                                0
                            ).toLocaleString()} Result${trainResultTotal === 1
                                ? ""
                                : "s"
                            }`
                            : `${(
                                trainTotal ||
                                0
                            ).toLocaleString()} Trains`
                        }
                    </span>
                </div>
            </div>
            {adminLoading ||
                searchLoading ? (
                <div className="admin-loading">
                    {searchLoading
                        ? "Searching trains..."
                        : "Loading trains..."}
                </div>
            ) : !searched ? (
                <div className="admin-empty">
                    <h3>
                        Search for a train
                    </h3>
                    <p>
                        Enter a train number,
                        train name, source or
                        destination to view
                        matching trains.
                    </p>
                </div>
            ) : trains.length === 0 ? (
                <div className="admin-empty">
                    <h3>
                        No trains found
                    </h3>
                    <p>
                        No trains matched
                        the selected search
                        filters.
                    </p>
                </div>
            ) : (
                <>
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>
                                        Train No
                                    </th>
                                    <th>
                                        Train Name
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
                                        Duration
                                    </th>
                                    <th>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {trains.map(
                                    (train) => (
                                        <tr
                                            key={
                                                train.trainNo
                                            }
                                        >
                                            <td>
                                                {
                                                    train.trainNo
                                                }
                                            </td>
                                            <td>
                                                {
                                                    train.trainName
                                                }
                                            </td>
                                            <td>
                                                {
                                                    train.source
                                                }
                                            </td>
                                            <td>
                                                {
                                                    train.destination
                                                }
                                            </td>
                                            <td>
                                                {
                                                    train.departure
                                                }
                                            </td>
                                            <td>
                                                {
                                                    train.arrival
                                                }
                                            </td>
                                            <td>
                                                {
                                                    train.duration
                                                }
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        type="button"
                                                        className="edit-btn"
                                                        onClick={() =>
                                                            handleEdit(
                                                                train.trainNo
                                                            )
                                                        }
                                                        disabled={
                                                            loadingTrain
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="delete-btn"
                                                        onClick={() =>
                                                            handleDelete(
                                                                train.trainNo
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
                    {searched &&
                        trainTotalPages > 1 && (
                            <div className="train-pagination">
                                <button
                                    type="button"
                                    disabled={
                                        trainPage === 1
                                    }
                                    onClick={() =>
                                        changePage(1)
                                    }
                                >
                                    « First
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        trainPage === 1
                                    }
                                    onClick={() =>
                                        changePage(
                                            trainPage - 1
                                        )
                                    }
                                >
                                    ← Previous
                                </button>
                                <span className="train-pagination-info">
                                    Page{" "}
                                    <strong>
                                        {trainPage}
                                    </strong>
                                    {" "}of{" "}
                                    <strong>
                                        {trainTotalPages}
                                    </strong>
                                </span>
                                <button
                                    type="button"
                                    disabled={
                                        trainPage ===
                                        trainTotalPages
                                    }
                                    onClick={() =>
                                        changePage(
                                            trainPage + 1
                                        )
                                    }
                                >
                                    Next →
                                </button>
                                <button
                                    type="button"
                                    disabled={
                                        trainPage ===
                                        trainTotalPages
                                    }
                                    onClick={() =>
                                        changePage(
                                            trainTotalPages
                                        )
                                    }
                                >
                                    Last »
                                </button>
                            </div>
                        )}
                </>
            )}
            {editingTrain && (
                <div className="train-edit-overlay">
                    <form
                        className="train-edit-modal"
                        onSubmit={handleSave}
                    >
                        <div className="train-modal-header">
                            <div>
                                <h2>
                                    {isAddingTrain
                                        ? "🚆 Add New Train"
                                        : "🚆 Edit Train"}
                                </h2>
                                <p>
                                    {isAddingTrain
                                        ? "Enter complete train information"
                                        : "Update complete train information"}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="close-modal-btn"
                                onClick={
                                    closeModal
                                }
                                disabled={saving}
                            >
                                ×
                            </button>
                        </div>
                        <div className="train-section">
                            <h3>
                                Basic Information
                            </h3>
                            <div className="train-form-grid">
                                <div className="train-input-group">
                                    <label>
                                        Train Number
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            editingTrain.trainNo ||
                                            ""
                                        }
                                        disabled={
                                            !isAddingTrain
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "trainNo",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="train-input-group">
                                    <label>
                                        Train Name
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            editingTrain.trainName ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "trainName",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="train-input-group">
                                    <label>
                                        Source
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            editingTrain.source ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "source",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="train-input-group">
                                    <label>
                                        Destination
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            editingTrain.destination ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "destination",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="train-input-group">
                                    <label>
                                        Departure
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="HH:MM"
                                        value={
                                            editingTrain.departure ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "departure",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="train-input-group">
                                    <label>
                                        Arrival
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="HH:MM"
                                        value={
                                            editingTrain.arrival ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "arrival",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="train-input-group">
                                    <label>
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 16h 30m"
                                        value={
                                            editingTrain.duration ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "duration",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                                <div className="train-input-group">
                                    <label>
                                        Distance
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={
                                            editingTrain.distance ??
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleFieldChange(
                                                "distance",
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="train-section">
                            <h3>
                                Operating Days
                            </h3>
                            <div className="train-days-container">
                                {[
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                    "Sun"
                                ].map(
                                    (day) => (
                                        <label
                                            key={day}
                                            className="train-day-option"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={(
                                                    editingTrain.on_which_day ||
                                                    []
                                                ).includes(day)}
                                                onChange={() =>
                                                    toggleDay(
                                                        day
                                                    )
                                                }
                                            />
                                            <span>
                                                {day}
                                            </span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="train-section">
                            <div className="train-section-title">
                                <div>
                                    <h3>
                                        Intermediate Stops
                                    </h3>
                                    <p>
                                        Manage station,
                                        arrival,
                                        departure,
                                        day, distance,
                                        halt and
                                        platform.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="add-stop-btn"
                                    onClick={
                                        addStop
                                    }
                                >
                                    + Add Stop
                                </button>
                            </div>
                            {(
                                editingTrain.stops ||
                                []
                            ).length === 0 ? (
                                <div className="no-stops">
                                    No intermediate
                                    stops.
                                </div>
                            ) : (
                                <div className="stops-container">
                                    {editingTrain.stops.map(
                                        (
                                            stop,
                                            index
                                        ) => (
                                            <div
                                                className="stop-card"
                                                key={index}
                                            >
                                                <div className="stop-card-header">
                                                    <strong>
                                                        Stop{" "}
                                                        {index + 1}
                                                    </strong>
                                                    <button
                                                        type="button"
                                                        className="remove-stop-btn"
                                                        onClick={() =>
                                                            removeStop(
                                                                index
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                                <div className="stop-grid">
                                                    <div className="train-input-group">
                                                        <label>
                                                            Station
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                stop?.station ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleStopChange(
                                                                    index,
                                                                    "station",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="train-input-group">
                                                        <label>
                                                            Arrival
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                stop?.arrival ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleStopChange(
                                                                    index,
                                                                    "arrival",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="train-input-group">
                                                        <label>
                                                            Departure
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={
                                                                stop?.departure ||
                                                                ""
                                                            }
                                                            onChange={(e) =>
                                                                handleStopChange(
                                                                    index,
                                                                    "departure",
                                                                    e.target.value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="train-input-group">
                                                        <label>
                                                            Day
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={
                                                                stop?.day ??
                                                                1
                                                            }
                                                            onChange={(e) =>
                                                                handleStopChange(
                                                                    index,
                                                                    "day",
                                                                    Number(
                                                                        e.target.value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="train-input-group">
                                                        <label>
                                                            Distance
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                stop?.distance ??
                                                                0
                                                            }
                                                            onChange={(e) =>
                                                                handleStopChange(
                                                                    index,
                                                                    "distance",
                                                                    Number(
                                                                        e.target.value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="train-input-group">
                                                        <label>
                                                            Halt
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                stop?.halt ??
                                                                0
                                                            }
                                                            onChange={(e) =>
                                                                handleStopChange(
                                                                    index,
                                                                    "halt",
                                                                    Number(
                                                                        e.target.value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    <div className="train-input-group">
                                                        <label>
                                                            Platform
                                                        </label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={
                                                                stop?.platform ??
                                                                0
                                                            }
                                                            onChange={(e) =>
                                                                handleStopChange(
                                                                    index,
                                                                    "platform",
                                                                    Number(
                                                                        e.target.value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="train-section">
                            <h3>
                                Seat Availability
                            </h3>
                            <div className="train-class-container">
                                {Object.entries(
                                    editingTrain.seatAvailability ||
                                    {}
                                ).map(
                                    (
                                        [
                                            className,
                                            seats
                                        ]
                                    ) => (
                                        <div
                                            className="train-class-card"
                                            key={className}
                                        >
                                            <h4>
                                                {className}
                                            </h4>
                                            <div className="train-input-group">
                                                <label>
                                                    Available Seats
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        seats ??
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleSeatAvailabilityChange(
                                                            className,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="train-section">
                            <h3>
                                Train Classes & Fares
                            </h3>
                            <div className="train-class-container">
                                {Object.entries(
                                    editingTrain.classes ||
                                    {}
                                ).map(
                                    (
                                        [
                                            className,
                                            fare
                                        ]
                                    ) => (
                                        <div
                                            className="train-class-card"
                                            key={className}
                                        >
                                            <h4>
                                                {className}
                                            </h4>
                                            <div className="train-input-group">
                                                <label>
                                                    Fare
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        fare ??
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        handleClassChange(
                                                            className,
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                        <div className="train-modal-actions">
                            <button
                                type="button"
                                className="cancel-train-btn"
                                onClick={
                                    closeModal
                                }
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="save-train-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : isAddingTrain
                                        ? "Add Train"
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
export default AdminTrains;
