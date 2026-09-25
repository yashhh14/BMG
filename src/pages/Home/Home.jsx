import "./Home.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeBg from "../../assets/hero_background.png";
import IntroAnimation from "../../components/IntroAnimation/IntroAnimation";
const INTRO_KEY = "bookmyjourney_intro_seen";
const INTRO_EXPIRY = 5 * 60 * 1000; // 5 minutes
const Home = () => {
  const [showLoader, setShowLoader] = useState(false);
  useEffect(() => {
    const savedTime = localStorage.getItem(INTRO_KEY);
    if (!savedTime) {
      setShowLoader(true);
      return;
    }
    const elapsedTime = Date.now() - Number(savedTime);
    if (elapsedTime >= INTRO_EXPIRY) {
      localStorage.removeItem(INTRO_KEY);
      setShowLoader(true);
    }
  }, []);
  const handleIntroComplete = () => {
    localStorage.setItem(
      INTRO_KEY,
      Date.now().toString()
    );
    setShowLoader(false);
  };


  return (
    <div className="home">
      {showLoader && (
        <IntroAnimation
          onComplete={handleIntroComplete}
        />
      )}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${HomeBg})`
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-tag">
            YOUR JOURNEY STARTS HERE
          </p>
          <h1>
            Plan Your Journey.
            <br />
            <span>Travel Without Limits.</span>
          </h1>
          <p className="hero-description">
            Book flights, trains, buses,
            cabs and hotels all in one place.
          </p>
          <div className="hero-buttons">
            <Link to="/flights">
              ✈️ Flights
            </Link>
            <Link to="/trains">
              🚆 Trains
            </Link>
            <Link to="/buses">
              🚌 Buses
            </Link>
            <Link to="/cabs">
              🚕 Cabs
            </Link>
            <Link to="/hotels">
              🏨 Hotels
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;