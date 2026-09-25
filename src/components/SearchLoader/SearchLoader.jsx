import React from "react";
import "./SearchLoader.css";

const SearchLoader = ({ type }) => {

    const loaders = {
        flight: {
            icon: "✈️",
            title: "Searching Flights",
            text: "Finding the best flights for your journey..."
        },

        train: {
            icon: "🚆",
            title: "Searching Trains",
            text: "Finding available trains for your journey..."
        },

        bus: {
            icon: "🚌",
            title: "Searching Buses",
            text: "Finding available buses for your journey..."
        },

        cab: {
            icon: "🚕",
            title: "Finding Cabs",
            text: "Finding available cabs near you..."
        },

        hotel: {
            icon: "🏨",
            title: "Searching Hotels",
            text: "Finding the best hotels for your stay..."
        }
    };

    const loader = loaders[type] || loaders.flight;

    return (
        <div className={`search-loader ${type}`}>

            <div className="loader-animation">
                <div className="loader-track"></div>

                <div className="loader-vehicle">
                    {loader.icon}
                </div>
            </div>

            <h2>{loader.title}</h2>

            <p>{loader.text}</p>

            <div className="loader-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>
    );
};

export default SearchLoader;