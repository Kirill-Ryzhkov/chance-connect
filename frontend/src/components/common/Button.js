import React from "react";

const Button = ({ handleClick, text }) => {
    return (
        <button className="mt-5 mx-2 py-3 px-5 text-lg bg-sky-600 hover:bg-sky-700 border-none rounded pointer transition-colors" onClick={handleClick}>{text}</button>
    );
};

export default Button;