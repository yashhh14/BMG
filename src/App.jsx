import Home from "./pages/Home/Home";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import Bookings from "./pages/Bookings/Bookings";
import Settings from "./pages/Settings/Settings";
import Support from "./pages/Support/Support";
import AdminLogin from "./pages/LoginSignUp/AdminLogin/AdminLogin";
import Trains from "./pages/Trains/Trains";
import Flights from "./pages/Flights/Flights";
import Busses from "./pages/Busses/Busses";
import Cabs from "./pages/Cabs/Cabs";
import Hotels from "./pages/Hotels/Hotels";
import Login from "./pages/LoginSignUp/Login/Login";
import Signup from "./pages/LoginSignUp/Signup/Signup";
import Layout from "./Layout";
import Dashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminTrains from "./pages/Admin/Trains/AdminTrains";
import AdminFlights from "./pages/Admin/Flights/AdminFlights";
import AdminBuses from "./pages/Admin/Buses/AdminBuses";
import AdminCabs from "./pages/Admin/Cabs/AdminCabs";
import AdminHotels from "./pages/Admin/Hotels/AdminHotels";
import { AdminProvider } from "./context/AdminContext";
import "./App.css";
import SinglePage from "./SinglePage/SinglePage";
import Booking from "./SinglePage/Booking";

const AdminLayout = () => {
    return (
        <AdminProvider>
            <Outlet />
        </AdminProvider>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/single/:service/:id" element={<SinglePage />} />
                    <Route path="/booking/:service/:id" element={<Booking />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/my-bookings" element={<Bookings />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/flights" element={<Flights />} />
                    <Route path="/trains" element={<Trains />} />
                    <Route path="/buses" element={<Busses />} />
                    <Route path="/cabs" element={<Cabs />} />
                    <Route path="/hotels" element={<Hotels />} />
                </Route>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<Dashboard />} />
                    <Route path="/admin/trains" element={<AdminTrains />} />
                    <Route path="/admin/flights" element={<AdminFlights />} />
                    <Route path="/admin/buses" element={<AdminBuses />} />
                    <Route path="/admin/cabs" element={<AdminCabs />} />
                    <Route path="/admin/hotels" element={<AdminHotels />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;