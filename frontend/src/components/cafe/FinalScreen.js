import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../header/Header";
import { ShowNumber } from "./ShowNumber";
import { Payment } from "./payment/Payment";
import "../../assets/css/body.css";

const API_URI = process.env.REACT_APP_BACKEND_API_URI;

export const FinalScreen = () => {
    const location = useLocation();
    const { order } = location.state ?? "";

    const [newOrder, setNewOrder] = useState("");
    const [error, setError] = useState("");

    const [queryParams] = useSearchParams();
    

    useEffect(() => {
        const paymentIntent = queryParams.get('payment_intent');

        if(paymentIntent){
            const url = `${API_URI}/order/payment`;
            const header = {
                "Content-Type": "application/json"
            };
            const body = {
                intent_id: paymentIntent
            };

            fetch(url, {
                method: "POST",
                headers: header,
                body: JSON.stringify(body)
            })
                .then((response) => response.json())
                .then((data) => {
                    if(data.success) {
                        setNewOrder(data.result);
                    } else {
                        setError("Payment Failed");
                    }
                    
                })
                .catch((error) => {
                    setError("Payment Failed");
                    console.error("Error:", error);
                });
        }
    }, []);
    

    return (
        <>
            <div className="header">
                <Header />
            </div>
            <div className="body">
            {
                error ? (
                    <h2 className="error-message">{error}</h2>
                ) : (
                    newOrder ? (
                        <ShowNumber number={newOrder.id_number} />
                    ) : (
                        order ? (
                            order.type === "order" ? (
                                <ShowNumber number={order.result.id_number} />
                            ) : (
                                <Payment clientSecret={order.result.client_secret} />
                            )
                        ) : (
                            <div className="loading">Processing your request...</div>
                        )
                    )
                )
            }
            </div>
        </>
    );
}