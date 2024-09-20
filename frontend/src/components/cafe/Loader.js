import React from "react";
import "../../assets/css/loader.css";

const Loader = () => {
    return (
        <div className="2xl-container h-full flex items-center justify-center">
            <div>
                <img className="sm:w-20 md:w-40 lg:w-48 circleImg" src="/circle-white.png" alt="Circle" />
            </div>
        </div>
    )
}

export default Loader;