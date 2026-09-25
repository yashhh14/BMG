import { NavLink } from "react-router-dom";
import "./ServiceMenu.css";

const ServiceMenu = () => {
    return (
        <div className="service-menu">
            <NavLink to="/flights" className={({ isActive }) => isActive ? "service-item active" : "service-item" } >
                <span>✈️</span>
                Flights
            </NavLink>
            <NavLink to="/trains" className={({ isActive }) => isActive ? "service-item active" : "service-item" } >
                <span>🚆</span>
                Trains
            </NavLink>
            <NavLink to="/buses" className={({ isActive }) => isActive ? "service-item active" : "service-item" } >
                <span>🚌</span>
                Bus
            </NavLink>
            <NavLink to="/cabs" className={({ isActive }) => isActive ? "service-item active" : "service-item" } >
                <span>🚕</span>
                Cabs
            </NavLink>
            <NavLink to="/hotels" className={({ isActive }) => isActive ? "service-item active" : "service-item" } >
                <span>🏨</span>
                Hotels
            </NavLink>
        </div>
    );
};

export default ServiceMenu;