import React from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/body.css";

export const RedirectButton = ({ text }) => {
    const navigate = useNavigate();

    return (
        <button className="redirect-button" onClick={() => navigate("/")}>{ text }</button>
    );
}