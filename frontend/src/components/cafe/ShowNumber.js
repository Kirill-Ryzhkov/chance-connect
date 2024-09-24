import React from "react";
import { HomeRedirect } from "./HomeRedirect";


export const ShowNumber = ({ number }) => {
    return (
        <>
            <h1 className="text-4xl">Your order number is<p className="text-4xl font-extrabold text-center">{number}</p></h1>
            <HomeRedirect />
        </>
    );
}