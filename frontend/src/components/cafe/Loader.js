import React from "react";
import "../../assets/css/loader.css";

const Loader = () => {
    return (
        <div className="content circle mb-4 flex items-center justify-center">
            <div>
                <img className="circleImg" src="/circle-white.png" alt="Circle" />
            </div>
        </div>
    )
}

export default Loader;