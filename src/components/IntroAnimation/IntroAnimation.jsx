import React, { useState } from "react";
import "./IntroAnimation.css";
import DesktopIntro from "../../assets/Intro_desktop.mp4";
import MobileIntro from "../../assets/Intro_mobile.mp4";
const IntroAnimation = ({ onComplete }) => {
    const [finished, setFinished] = useState(false);
    const handleVideoEnd = () => {
        if (!finished) {
            setFinished(true);
            onComplete();
        }
    };
    return (
        <div className="intro-animation">
            <video className="intro-video intro-video-desktop" src={DesktopIntro} autoPlay muted playsInline preload="auto" onEnded={handleVideoEnd} />
            <video className="intro-video intro-video-mobile" src={MobileIntro} autoPlay muted playsInline preload="auto" onEnded={handleVideoEnd} />
        </div>
    );
};

export default IntroAnimation;