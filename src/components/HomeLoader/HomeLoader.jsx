import React, { useEffect } from "react";
import "./HomeLoader.css";
import GlobeImage from "../../assets/globe-loader.png";
const INTRO_KEY = "bookmyjourney_intro_seen";
const INTRO_EXPIRY = 5 * 60 * 1000; // 5 minutes
const HomeLoader = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem(
                INTRO_KEY,
                Date.now().toString()
            );
            onComplete();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onComplete]);
    return (
        <div className="home-loader-overlay">
            <div className="home-loader-card">
                <div className="home-loader-scene">
                    <div className="scene-glow"></div>
                    <div className="scene-orbit orbit-one">
                        <span className="orbit-light light-one"></span>
                    </div>
                    <div className="scene-orbit orbit-two">
                        <span className="orbit-light light-two"></span>
                    </div>
                    <div className="scene-orbit orbit-three">
                        <span className="orbit-light light-three"></span>
                    </div>
                    <img src={GlobeImage} alt="" className="home-globe-image" />
                    <span className="scene-particle particle-one"></span>
                    <span className="scene-particle particle-two"></span>
                    <span className="scene-particle particle-three"></span>
                    <span className="scene-particle particle-four"></span>
                    <span className="scene-particle particle-five"></span>
                </div>
                <div className="home-loader-content">
                    <h2>
                        Welcome to BookMyJourney
                    </h2>
                    <p>
                        Preparing your journey...
                    </p>
                </div>
                <div className="home-loader-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="home-loader-status">
                    <span className="status-spinner"></span>Please wait...
                </div>
                <div className="home-loader-footer">
                    EXPLORE&nbsp;&nbsp; • &nbsp;&nbsp;DISCOVER&nbsp;&nbsp; • &nbsp;&nbsp;JOURNEY
                </div>
            </div>
        </div>
    );
};

export default HomeLoader;