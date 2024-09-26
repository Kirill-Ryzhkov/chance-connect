import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RedirectButton from "../common/RedirectButton";

export const HomeRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate("/");
        }, 10000)

        return () => clearTimeout(timer);
    }, []);
    
    return (
        <RedirectButton
            text={"Go Home"}
            url={'/'}
        />
    );
}