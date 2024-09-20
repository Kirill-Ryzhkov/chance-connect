import React from "react";
import { useNavigate } from "react-router-dom";

const RedirectButton = ({ text, url }) => {
    const navigate = useNavigate();

    return (
        <button className="mt-5 py-3 px-5 text-lg bg-sky-600 hover:bg-sky-700 border-none rounded pointer transition-colors" onClick={() => navigate(url)}>{ text }</button>
    );
}

export default RedirectButton;