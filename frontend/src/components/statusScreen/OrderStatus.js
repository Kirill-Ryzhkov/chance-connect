import React, { useEffect, useState } from "react";
import Header from "../header/Header";

const API_URI = process.env.REACT_APP_BACKEND_API_URI;

export const OrderStatus = () => {
    const [idNumbersCompleted, setIdNumbersCompleted] = useState([]);
    const [idNumbersNotCompleted, setIdNumbersNotCompleted] = useState([]);
    const [isShowingOrder, setIsShowingOrder] = useState(false);
    const [showingOrders, setShowingOrders] = useState([]);

    const showDialog = (commonElements) => {
        if (commonElements.length > 0) {
            setIsShowingOrder(true);
            setShowingOrders(commonElements);
            setTimeout(() => {
                setIsShowingOrder(false);
            }, 5000);
        }
    }
    

    useEffect(() => {
        const fetchCafeStatus = () => {
            const url = `${API_URI}/order/`;
            const header = {
                "Content-Type": "application/json"
            };

            fetch(url, {
                method: "GET",
                headers: header
            })
            .then((response) => response.json())
            .then((data) => {
                const newCompletedOrders = data.orders.filter(order => order.complete).reverse();
                const newCompletedIdNumbers = newCompletedOrders.map(order => order.id_number);
            
                setIdNumbersNotCompleted(prevNotCompletedIdNumbers => {

                    console.log("newCompletedIdNumbers", newCompletedIdNumbers);

                    const commonElements = newCompletedIdNumbers.filter((element) => 
                        prevNotCompletedIdNumbers.includes(element));
            
                    console.log("commonElements", commonElements);

                    showDialog(commonElements);
            
                    return data.orders.filter(order => !order.complete).map(order => order.id_number);
                });
            
                setIdNumbersCompleted(newCompletedIdNumbers);
            })
            .catch((error) => console.error("Error:", error));
        };
        fetchCafeStatus();
        const intervalId = setInterval(fetchCafeStatus, 10000);
    
        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <Header />
            <div className="w-screen h-auto mt-7 flex">
                <div className="in-progress w-1/2 text-center">
                    <h2 className="text-3xl">In Progress</h2>
                    <div className="h-auto bg-yellow-400 mt-5 flex flex-wrap justify-center">
                    { idNumbersNotCompleted.map((id_number, index) => (
                        <div key={index} className="text-white text-3xl py-2 px-3 drop-shadow-md">
                            {id_number}
                        </div>
                    )) }
                    </div>
                </div>
                <div className="in-progress w-1/2 text-center">
                    <h2 className="text-3xl">Complete</h2>
                    <div className="h-h-auto bg-lime-400 mt-5 flex flex-wrap justify-center">
                    { idNumbersCompleted.map((id_number, index) => (
                        <div key={index} className="text-white text-3xl py-2 px-3 drop-shadow-md">
                            {id_number}
                        </div>
                    )) }
                    </div>
                </div>
            </div>
            {isShowingOrder && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white text-black text-6xl p-10 rounded-lg">
                        Order is ready: {showingOrders.toString()}
                    </div>
                </div>
            )}
        </>
    )

}