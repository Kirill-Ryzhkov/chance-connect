import React, { useEffect, useState, useCallback } from "react";
import { useCookies } from 'react-cookie';
import Header from "../header/Header";
import { OrderTablesWithTabs } from "./OrderTablesWithTabs";
import Button from "../common/Button";

const API_URI = process.env.REACT_APP_BACKEND_API_URI;
const ADMIN_LOGIN = process.env.REACT_APP_ADMIN_USER_LOGIN;
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_USER_PASSWORD;
const EVENT_NAME = process.env.REACT_APP_EVENT_NAME;

export const OrdersTable = () => {

    const [auth, setAuth] = useState('');
    const [orders, setOrders] = useState([]);
    const [cookie, setCookie] = useCookies(['authToken']);
    const [isOpenCafe, setIsOpenCafe] = useState();

    const fetchData = useCallback(async (url, method = "GET", token = "", body = null) => {
        const headers = {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        };

        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        const response = await fetch(url, options);
        return response.json();
    }, []);


    useEffect(() => {
        if (cookie.authToken) {
            setAuth(cookie.authToken);
            orderList(cookie.authToken);
        }
    }, [cookie.authToken]);

    useEffect(() => {
        if (!auth) return;

        const intervalId = setInterval(() => {
            orderList(auth);
        }, 10000);

        return () => clearInterval(intervalId);
    }, [auth]);

    useEffect(() => {
        fetchData(`${API_URI}/event/statusCafe/${EVENT_NAME}`)
            .then(data => setIsOpenCafe(data.status.open))
            .catch(console.error);
    }, [fetchData]);

    const orderList = useCallback((token) => {
        fetchData(`${API_URI}/order`, "GET", token)
            .then(data => setOrders(data.orders))
            .catch(console.error);
    }, [fetchData]);

    const handleClose = useCallback(() => {
        fetchData(`${API_URI}/event/toggleCafe/${EVENT_NAME}`, "GET", auth)
            .then(() => setIsOpenCafe(!isOpenCafe))
            .catch(console.error);
    }, [auth, isOpenCafe, fetchData]);

    const handleComplete = useCallback((id) => {
        fetchData(`${API_URI}/order/complete`, "POST", auth, { order_id: id })
            .then(data => setOrders(data.orders))
            .catch(console.error);
    }, [auth, fetchData]);

    const authorize = useCallback(() => {
        if (!auth) {
            fetchData(`${API_URI}/user/signin`, "POST", "", {
                email: ADMIN_LOGIN,
                password: ADMIN_PASSWORD
            })
            .then(data => {
                setCookie('authToken', data.token, { path: '/', expires: new Date(Date.now() + 3600000) });
                setAuth(data.token);
                orderList(data.token);
            })
            .catch(console.error);
        }
    }, [auth, fetchData, setCookie]);

    const handlePrompt = useCallback(() => {
        const password = window.prompt('Please enter the password:', '');
        if (password === ADMIN_PASSWORD) {
            authorize();
        } else if (password !== null) {
            handlePrompt();
        }
    }, [authorize]);
    

    return (
        <>
            <div className="header">
                <Header />
            </div>
            <div className="orders-table">
                {!auth 
                    ? 
                    <div className="w-full text-center">
                        <Button 
                            handleClick={handlePrompt}
                            text={"Get Orders"} />
                    </div>
                    : <OrderTablesWithTabs
                        orders={orders}
                        updateOrders={setOrders}
                        completeOrder={handleComplete}
                        statusCafe={isOpenCafe}
                        toggleCafe={handleClose}
                        auth={auth}/> 
                }
            </div>
        </>
    )
}