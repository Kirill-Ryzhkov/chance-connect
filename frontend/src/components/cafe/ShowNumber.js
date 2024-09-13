import React, { useEffect } from "react";
import { HomeRedirect } from "./HomeRedirect";


export const ShowNumber = ({ number }) => {
    return (
        <>
            <h1>Number of your order is {number}</h1>
            <HomeRedirect />
        </>
    );
}