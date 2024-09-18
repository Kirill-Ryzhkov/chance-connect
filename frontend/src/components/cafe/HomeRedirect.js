import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/body.css";
import { RedirectButton } from "./RedirectButton";

export const HomeRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/cafe");
        }, 10000)

        return () => clearTimeout(timer);
    }, []);
    
    return (
        <RedirectButton text={"Go Home"} />
    );
}