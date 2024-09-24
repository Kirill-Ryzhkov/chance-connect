import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Arrow from "./Arrow";
import Loader from "./Loader";
import CafeMenu from "./CafeMenu";
import { HomeRedirect } from "./HomeRedirect";

const API_URI = process.env.REACT_APP_BACKEND_API_URI;
const EVENT_NAME = process.env.REACT_APP_EVENT_NAME;

export const WholeCafe = () => {

    const [tappedCard, setTappedCard] = useState(false);
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState("");
    const [isOpenCafe, setIsOpenCafe] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:2000")
    
        socket.onopen = () => {
            console.log("WebSocket connection opened")
        }
    
        socket.onmessage = (event) => {
            const card = event.data;
            const pattern = "cardID";

            if (card.includes(pattern)) {
                setTappedCard(true);
                const cardId = card.split(":")[1]
                console.log("card ", cardId);
        
                let url = `${API_URI}/user/get-token`;
                let header = {
                    "Content-Type": "application/json"
                };
        
                const body = {
                    nfc_id: cardId
                };

                setTimeout(() => {
                    fetch(url, {
                        method: "POST",
                        headers: header,
                        body: JSON.stringify(body),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if(data.error) {
                                setError(true);
                            } else {
                                setAuth(data.authToken);
                                setUser(data.user);
                            }
                        })
                        .catch((error) => console.error("Error:", error))
                  }, 1000);
            }
        }

        return () => {
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
                console.log("WebSocket connection closed");
            }
        };
    }, []);

    useEffect(() => {
        const fetchCafeStatus = () => {
            const url = `${API_URI}/event/statusCafe/${EVENT_NAME}`;
            const header = {
                "Content-Type": "application/json"
            };
    
            fetch(url, {
                method: "GET",
                headers: header
            })
            .then((response) => response.json())
            .then((data) => {
                setIsOpenCafe(data.status.open);
            })
            .catch((error) => console.error("Error:", error));
        };
        fetchCafeStatus();
        const intervalId = setInterval(fetchCafeStatus, 10000);
    
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="App">
            <div className="header 2xl:container h-16">
                <div className="h-full">
                    <Header userData={user} />
                </div>
            </div>
            
            {!error ? (
                isOpenCafe ? 
                    <div className="body 2xl:container h-[32rem]">
                        <div className="h-full content-center items-center">
                            { !auth ? (
                                !tappedCard ? <Arrow /> : <Loader />
                            ) : <CafeMenu 
                                    user={user}
                                    updateBalance={setUser} 
                                    auth={auth}
                                />}
                        </div>
                    </div> 
                    : <h1 className="2xl:container md:text-4xl sm:text-2xl mt-20 text-center">Cafe is closed</h1> )
                    :   <>
                            <h1 className="2xl:container md:text-4xl sm:text-2xl mt-20 text-center">User not found</h1>
                            <div className="absolute bottom-10 left-20 z-50">
                                <HomeRedirect />
                            </div>
                        </>
                    }
        </div>
    );
}