import React, { useEffect } from "react";

export const FinalOrder = ({ order, balance }) => {
    useEffect(() => {
        if (order) {
            balance();
        }
    }, [order]);
    return (
        <h1>Number of your order is {order.id_number}</h1>
    );
}