import "./Support.css";
import HomeBg from "../../assets/hero_background.png";

const Support = () => {
  return (
    <div className="support-page">

      <section className="support-hero" style={{
        backgroundImage: `url(${HomeBg})`
      }}>

        <div className="support-icon">
          ❓
        </div>

        <h1>
          How Can We Help?
        </h1>

        <p>
          Find answers to your questions or contact our
          support team.
        </p>

        <div className="support-search">
          🔍

          <input
            type="text"
            placeholder="Search for help..."
          />
        </div>

      </section>


      <section className="support-content">

        <h2>What do you need help with?</h2>

        <div className="support-cards">

          <div className="support-card">
            <span>🎫</span>
            <h3>Bookings</h3>
            <p>
              Manage, cancel or check your bookings.
            </p>
            <button>Learn More →</button>
          </div>

          <div className="support-card">
            <span>💳</span>
            <h3>Payments</h3>
            <p>
              Get help with payments and refunds.
            </p>
            <button>Learn More →</button>
          </div>

          <div className="support-card">
            <span>✈️</span>
            <h3>Travel</h3>
            <p>
              Information about flights, trains and buses.
            </p>
            <button>Learn More →</button>
          </div>

          <div className="support-card">
            <span>🔐</span>
            <h3>Account</h3>
            <p>
              Get help with your account and security.
            </p>
            <button>Learn More →</button>
          </div>

        </div>


        <div className="contact-support">

          <div>
            <h2>Still need help?</h2>

            <p>
              Our support team is here to help you.
            </p>
          </div>

          <button>
            Contact Support →
          </button>

        </div>

      </section>

    </div>
  );
};

export default Support;