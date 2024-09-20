import React from "react";
import { HomeRedirect } from "./HomeRedirect";


export const ShowNumber = ({ number }) => {
    return (
        <>
            <h1 className="text-2xl">Number of your order is {number}</h1>
            <HomeRedirect />
        </>
    );
}