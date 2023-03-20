import React from "react";
import Tilt from 'react-parallax-tilt';
import './Logo.css';
import brain from './brain.png';
const Logo = () => {
    return (
        <div className="ma4 mt0">
            <Tilt>
                <div className="tilt pa3">
                    <img src={brain} alt='Big Brain'/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;