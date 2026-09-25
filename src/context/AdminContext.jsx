import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
const AdminContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;
export const AdminProvider = ({ children }) => {
    const [trains, setTrains] = useState([]);
    const [trainTotal, setTrainTotal] = useState(0);
    const [trainResultTotal, setTrainResultTotal] = useState(0);
    const [trainPage, setTrainPage] = useState(1);
    const [trainTotalPages, setTrainTotalPages] = useState(0);
    const [flights, setFlights] = useState([]);
    const [buses, setBuses] = useState([]);
    const [cabs, setCabs] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchTrainCount = async () => {
        try {
            const response = await axios.get(`${API_URL}api/admin/trains/count`,
                {
                    withCredentials: true
                }
            );
            setTrainTotal(Number(response.data.total) || 0);
        } catch (error) {
            setTrainTotal(0);
        }
    };
    const searchTrains = async (filters = {}, page = 1) => {
        try {
            const params = new URLSearchParams();
            if (filters?.trainNo?.trim()) {
                params.set("trainNo", filters.trainNo.trim());
            }
            if (filters?.trainName?.trim()) {
                params.set("trainName", filters.trainName.trim());
            }
            if (filters?.source?.trim()) {
                params.set("source",filters.source.trim());
            }
            if (filters?.destination?.trim()) {
                params.set("destination",filters.destination.trim());
            }
            params.set("page",page);
            params.set("limit",25);
            const response = await axios.get(`${API_URL}api/admin/trains?${params.toString()}`,
                {
                    withCredentials: true
                }
            );
            setTrains(response.data.trains || []);
            setTrainResultTotal(Number(response.data.total) || 0);
            setTrainPage(Number(response.data.page) || 1);
            setTrainTotalPages(Number(response.data.totalPages) || 0);
            return response.data;
        } catch (error) {
            throw error;
        }
    };
    const fetchAdminData = async () => {
        try {
            setLoading(true);
            await fetchTrainCount();
            const [flightsResponse,busesResponse,cabsResponse,hotelsResponse] = await Promise.all([axios.get(`${API_URL}api/admin/flights`,
                    {
                        withCredentials: true
                    }
                ),
                axios.get(`${API_URL}api/admin/buses`,
                    {
                        withCredentials: true
                    }
                ),

                axios.get(`${API_URL}api/admin/cabs`,
                    {
                        withCredentials: true
                    }
                ),
                axios.get(`${API_URL}api/admin/hotels`,
                    {
                        withCredentials: true
                    }
                )
            ]);
            setFlights(flightsResponse.data.flights || []);
            setBuses(busesResponse.data.buses || []);
            setCabs(cabsResponse.data.cabs || []);
            setHotels(hotelsResponse.data.hotels || []);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchAdminData();
    }, []);
    return (
        <AdminContext.Provider value={{ trains, setTrains, trainTotal, setTrainTotal, trainResultTotal, setTrainResultTotal, trainPage, setTrainPage, trainTotalPages, setTrainTotalPages, searchTrains, fetchTrainCount, flights, setFlights, buses, setBuses, cabs, setCabs, hotels, setHotels, loading, fetchAdminData }}>
            {children}
        </AdminContext.Provider>
    );
};
export const useAdmin = () => { return useContext(AdminContext); };