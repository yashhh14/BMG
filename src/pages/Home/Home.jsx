import './Home.css'
import HomeBg from "../../assets/hero_background.png";
import { Link } from 'react-router-dom';
const Home = () => {
  return (
    <div className="home">

      <section className="hero" style={{ backgroundImage: `url(${HomeBg})` }} >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-tag">
            YOUR JOURNEY STARTS HERE
          </p>
          <h1>Plan Your Journey.<br /><span>Travel Without Limits.</span>
          </h1>
          <p className="hero-description">Book flights, trains, buses, cabs and hotels all in one place.</p>
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