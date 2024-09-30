import React, { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Header from "../header/Header";
import { ShowNumber } from "./ShowNumber";
import { Payment } from "./payment/Payment";
import { HomeRedirect } from "./HomeRedirect";
import { useProcessPaymentMutation } from "../../services/apiSlice"; 

export const FinalScreen = () => {
    const location = useLocation();
    const { order } = location.state ?? "";

    const [newOrder, setNewOrder] = useState(""); 
    const [error, setError] = useState("");

    const [queryParams] = useSearchParams();

    // хук RTK Query для обработки платежа
    const [processPayment] = useProcessPaymentMutation();

    useEffect(() => {
        const paymentIntent = queryParams.get('payment_intent');

        if (paymentIntent) {
            const paymentData = {
                intent_id: paymentIntent
            };

            processPayment(paymentData)
                .unwrap()
                .then((data) => {
                    if (data.success) {
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
    }, [queryParams, processPayment]); 


    return (
        <>
            <div className="header">
                <Header />
            </div>
            <div className="mt-20 flex flex-col justify-center items-center align-center">
            {
                error ? (
                    <>
                        <h2 className="text-4xl">{error}</h2>
                        <HomeRedirect />
                    </>
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