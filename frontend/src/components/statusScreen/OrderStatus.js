import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import { useFetchOrdersStatusQuery } from "../../services/apiSlice"; 

export const OrderStatus = () => {
    const [idNumbersCompleted, setIdNumbersCompleted] = useState([]); 
    const [idNumbersNotCompleted, setIdNumbersNotCompleted] = useState([]); 
    const [isShowingOrder, setIsShowingOrder] = useState(false);
    const [showingOrders, setShowingOrders] = useState([]);

    const { data, error, isLoading, refetch } = useFetchOrdersStatusQuery();

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
        if (data) {
            const newCompletedOrders = data.orders.filter(order => order.complete).reverse();
            const newCompletedIdNumbers = newCompletedOrders.map(order => order.id_number);

            setIdNumbersNotCompleted(prevNotCompletedIdNumbers => {
                const commonElements = newCompletedIdNumbers.filter((element) => 
                    prevNotCompletedIdNumbers.includes(element)
                );
                showDialog(commonElements);

                return data.orders.filter(order => !order.complete).map(order => order.id_number);
            });

            setIdNumbersCompleted(newCompletedIdNumbers);
        }
    }, [data]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch(); 
        }, 10000);
        return () => clearInterval(intervalId);
    }, [refetch]);

    if (isLoading) return <p>Loading...</p>; 
    if (error) return <p>Error fetching data</p>;

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
    );
}
