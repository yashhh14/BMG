import "./PageLoader.css";
const PageLoader = ({ type = "loading" }) => {
    const loaderContent = {
        loading: { title: "Loading", text: "Please wait..." },
        login: { title: "Welcome Back", text: "Signing you in to BookMyJourney..." },
        signup: { title: "Creating Your Account", text: "Setting up your BookMyJourney account..." },
        logout: { title: "Logging Out", text: "Securing your session..." },
        home: { title: "Welcome to BookMyJourney", text: "Preparing your journey..." },
        flight: { title: "Searching Flights", text: "Finding the best flights for your journey..." },
        train: { title: "Searching Trains", text: "Finding available trains for your journey..." },
        adminTrain: { title: "Loading Trains", text: "Please wait........" },
        bus: { title: "Searching Buses", text: "Finding available buses for your journey..." },
        cab: { title: "Finding Cabs", text: "Finding available cabs near you..." },
        hotel: { title: "Searching Hotels", text: "Finding the best hotels for your stay..." },
        booking: { title: "Processing Booking", text: "Confirming your journey..." }
    };
    const content =loaderContent[type] || loaderContent.loading;
    const Train = () => (
        <div className="vehicle-scene train-scene">
            <div className="rail-track">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="train">
                <div className="train-engine">
                    <div className="train-front-window"></div>
                    <div className="train-light"></div>
                    <div className="train-body-top"></div>
                    <div className="train-wheel wheel-1"></div>
                    <div className="train-wheel wheel-2"></div>
                </div>
                <div className="train-compartment">
                    <div className="train-window"></div>
                    <div className="train-window"></div>
                    <div className="train-door"></div>
                    <div className="train-wheel"></div>
                    <div className="train-wheel wheel-right"></div>
                </div>
                <div className="train-compartment">
                    <div className="train-window"></div>
                    <div className="train-window"></div>
                    <div className="train-door"></div>
                    <div className="train-wheel"></div>
                    <div className="train-wheel wheel-right"></div>
                </div>
                <div className="train-compartment">
                    <div className="train-window"></div>
                    <div className="train-window"></div>
                    <div className="train-door"></div>
                    <div className="train-wheel"></div>
                    <div className="train-wheel wheel-right"></div>
                </div>
            </div>
        </div>
    );
    const adminTrain = () => (
        <div className="vehicle-scene train-scene">
            <div className="rail-track">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div className="train">
                <div className="train-engine">
                    <div className="train-front-window"></div>
                    <div className="train-light"></div>
                    <div className="train-body-top"></div>
                    <div className="train-wheel wheel-1"></div>
                    <div className="train-wheel wheel-2"></div>
                </div>
                <div className="train-compartment">
                    <div className="train-window"></div>
                    <div className="train-window"></div>
                    <div className="train-door"></div>
                    <div className="train-wheel"></div>
                    <div className="train-wheel wheel-right"></div>
                </div>
                <div className="train-compartment">
                    <div className="train-window"></div>
                    <div className="train-window"></div>
                    <div className="train-door"></div>
                    <div className="train-wheel"></div>
                    <div className="train-wheel wheel-right"></div>
                </div>
                {/* Compartment 3 */}
                <div className="train-compartment">
                    <div className="train-window"></div>
                    <div className="train-window"></div>
                    <div className="train-door"></div>
                    <div className="train-wheel"></div>
                    <div className="train-wheel wheel-right"></div>
                </div>
            </div>
        </div>
    );
    const Bus = () => (
        <div className="vehicle-scene bus-scene">
            <div className="road">
                <div className="road-line"></div>
            </div>
            <div className="bus">
                <div className="bus-top"></div>
                <div className="bus-window bus-window-1"></div>
                <div className="bus-window bus-window-2"></div>
                <div className="bus-window bus-window-3"></div>
                <div className="bus-window bus-window-4"></div>
                <div className="bus-door"></div>
                <div className="bus-wheel bus-wheel-left"></div>
                <div className="bus-wheel bus-wheel-right"></div>
                <div className="bus-headlight"></div>
            </div>
        </div>
    );
    const Cab = () => (
        <div className="vehicle-scene cab-scene">
            <div className="cab-road">
                <div className="road-line"></div>
            </div>
            <div className="cab">
                <div className="cab-roof"></div>
                <div className="cab-window cab-window-left"></div>
                <div className="cab-window cab-window-right"></div>
                <div className="cab-body"></div>
                <div className="cab-wheel cab-wheel-left"></div>
                <div className="cab-wheel cab-wheel-right"></div>
                <div className="cab-light"></div>
            </div>
        </div>
    );
    const Flight = () => (
        <div className="vehicle-scene flight-scene">
            <div className="cloud cloud-1"></div>
            <div className="cloud cloud-2"></div>
            <div className="cloud cloud-3"></div>
            <div className="airplane">
                <div className="plane-body"></div>
                <div className="plane-nose"></div>
                <div className="plane-wing plane-wing-top"></div>
                <div className="plane-wing plane-wing-bottom"></div>
                <div className="plane-tail"></div>
                <div className="plane-window p-window-1"></div>
                <div className="plane-window p-window-2"></div>
                <div className="plane-window p-window-3"></div>
                <div className="plane-window p-window-4"></div>
                <div className="plane-window p-window-5"></div>
            </div>
            <div className="flight-trail"></div>
        </div>
    );
    const Hotel = () => (
        <div className="vehicle-scene hotel-scene">
            <div className="hotel-building">
                <div className="hotel-roof"></div>
                <div className="hotel-sign">
                    HOTEL
                </div>
                <div className="hotel-row">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="hotel-row">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="hotel-door"></div>
            </div>
        </div>
    );
    const renderVehicle = () => {
        switch (type) {
            case "login":
                return <LoginAnimation />;
            case "signup":
                return <SignupAnimation />;
            case "logout":
                return <LogoutAnimation />;
            case "train":
                return <Train />;
            case "bus":
                return <Bus />;
            case "cab":
                return <Cab />;
            case "adminTrain":
                return <Train />;
            case "flight":
                return <Flight />;
            case "hotel":
                return <Hotel />;
            default:
                return <Train />;
        }
    };
    const LoginAnimation = () => (
        <div className="auth-animation login-animation">
            <div className="auth-circle"></div>
            <div className="login-user">
                <div className="user-head"></div>
                <div className="user-body"></div>
            </div>
            <div className="login-check">
                ✓
            </div>
        </div>
    );
    const SignupAnimation = () => (
        <div className="auth-animation signup-animation">
            <div className="loader-signup-card">
                <div className="signup-avatar">
                    +
                </div>
                <div className="signup-line line-one"></div>
                <div className="signup-line line-two"></div>
                <div className="signup-line line-three"></div>
            </div>
            <div className="signup-plus">
                +
            </div>
        </div>
    );

    const LogoutAnimation = () => (
        <div className="auth-animation logout-animation">
            <div className="logout-door">
                <div className="logout-door-handle"></div>
            </div>
            <div className="logout-user">
                <div className="logout-head"></div>
                <div className="logout-body"></div>
            </div>
            <div className="logout-arrow">
                →
            </div>
        </div>
    );
    return (
        <div className="page-loader-overlay">
            <div className="page-loader-card">
                <div className="page-loader-animation">
                    {renderVehicle()}
                </div>
                <div className="page-loader-content">
                    <h2>{content.title}</h2>
                    <p>{content.text}</p>
                </div>
                <div className="page-loader-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="page-loader-status">
                    <span className="page-loader-pulse"></span>
                    Please wait...
                </div>
            </div>
        </div>
    );
};

export default PageLoader;