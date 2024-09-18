import React, { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import Header from "../header/Header";
import { OrderTablesWithTabs } from "./OrderTablesWithTabs";
import "../../assets/css/body.css";

const API_URI = process.env.REACT_APP_BACKEND_API_URI;
const ADMIN_LOGIN = process.env.REACT_APP_ADMIN_USER_LOGIN;
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_USER_PASSWORD;
const EVENT_NAME = process.env.REACT_APP_EVENT_NAME;

export const OrdersTable = () => {

    const [auth, setAuth] = useState('');
    const [orders, setOrders] = useState([]);
    const [cookie, setCookie] = useCookies(['authToken']);
    const [isOpenCafe, setIsOpenCafe] = useState();

    useEffect(() => {
        if(cookie.authToken !== undefined) {
            setAuth(cookie.authToken);
            orderList(cookie.authToken);
        }
    }, [cookie.authToken]);

    useEffect(() => {
        let intervalId;

        if (auth) {
            intervalId = setInterval(() => {
                orderList(auth);
            }, 10000);
        }

        return () => clearInterval(intervalId);
    }, [auth]);

    useEffect(() => {
        const url = `${API_URI}/event/statusCafe/${EVENT_NAME}`;
        const header = {
            "Content-Type": "application/json"
        }

        fetch(url, {
            method: "GET",
            headers: header
        })
            .then((response) => response.json())
            .then((data) => {
                setIsOpenCafe(data.status.open);
            })
            .catch((error) => console.error("Error:", error));
        
    }, []);

    const handlePrompt = () => {
        const password = window.prompt('Please enter the password:', '');
        if (password == ADMIN_PASSWORD) {
            authorize();
        } else if(password === null) {}
        else {
            handlePrompt();
        }
    };

    const authorize = () => {
        if(!auth) {
            const url = `${API_URI}/user/signin`;
            const header = {
                "Content-Type": "application/json"
            };
            const body = {
                email: ADMIN_LOGIN,
                password: ADMIN_PASSWORD
            }
            
            fetch(url, {
                method: "POST",
                headers: header,
                body: JSON.stringify(body)
            })
                .then((response) => response.json())
                .then((data) => {
                    setCookie('authToken', data.token, { path: '/', expires: new Date(Date.now() + 3600000) });
                    setAuth(data.token);
                    orderList(data.token);
                })
                .catch((error) => console.error("Error:", error));

            
        }
    }

    const orderList = (token) => {
        const url = `${API_URI}/order`;
        const header = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        };
        
        fetch(url, {
            method: "GET",
            headers: header
        })
            .then((response) => response.json())
            .then((data) => {
                setOrders(data.orders);
            })
            .catch((error) => console.error("Error:", error));
    }

    const handleClose = () => {
        const url = `${API_URI}/event/toggleCafe/${EVENT_NAME}`;
        const header = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth
        };
    
        fetch(url, {
            method: "GET",
            headers: header,
        })
            .then((response) => response.json())
            .then((data) => {
                setIsOpenCafe(!isOpenCafe);
            })
            .catch((error) => console.error("Error:", error));
    }

    const handleComplete = (id) => {
        const url = `${API_URI}/order/complete`;
        const header = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth
        };
        const body = {
            order_id: id
        };
    
        fetch(url, {
            method: "POST",
            headers: header,
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((data) => {
                setOrders(data.orders);
            })
            .catch((error) => console.error("Error:", error));
      }
    

    return (
        <>
            <div className="header">
                <Header />
            </div>
            <div className="orders-table">
                {!auth 
                    ? <button className="redirect-button" onClick={handlePrompt}>Get Orders</button>
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