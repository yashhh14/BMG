import "./Settings.css";
import HomeBg from "../../assets/hero_background.png";

const Settings = () => {
    return (
        <div className="settings-page"  style={{ backgroundImage: `url(${HomeBg})` }}>

            <div className="settings-header">
                <span>⚙️</span>

                <div>
                    <h1>Settings</h1>
                    <p>Manage your account and application preferences.</p>
                </div>
            </div>

            <div className="settings-container">


                <div className="settings-card">

                    <h2>👤 Account</h2>

                    <div className="setting-row">
                        <div>
                            <strong>Profile Information</strong>
                            <p>Update your personal information.</p>
                        </div>

                        <button>Edit</button>
                    </div>

                    <div className="setting-row">
                        <div>
                            <strong>Password</strong>
                            <p>Change your account password.</p>
                        </div>

                        <button>Change</button>
                    </div>

                </div>


                <div className="settings-card">

                    <h2>🔔 Preferences</h2>

                    <div className="setting-row">
                        <div>
                            <strong>Email Notifications</strong>
                            <p>Receive booking and travel updates.</p>
                        </div>

                        <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span></span>
                        </label>
                    </div>

                    <div className="setting-row">
                        <div>
                            <strong>Promotional Offers</strong>
                            <p>Receive travel deals and offers.</p>
                        </div>

                        <label className="switch">
                            <input type="checkbox" />
                            <span></span>
                        </label>
                    </div>

                </div>


                <div className="settings-card">

                    <h2>🔐 Security</h2>

                    <div className="setting-row">
                        <div>
                            <strong>Two-Factor Authentication</strong>
                            <p>Add an extra layer of account security.</p>
                        </div>

                        <button>Enable</button>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Settings;