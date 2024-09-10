import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Arrow from "./Arrow";
import Loader from "./Loader";
import CafeMenu from "./CafeMenu";

const API_URI = process.env.REACT_APP_BACKEND_API_URI;

export const WholeCafe = () => {

    const [tappedCard, setTappedCard] = useState(false);
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState("");

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
                            setAuth(data.authToken);
                            setUser(data.user);
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

    return (
        <div className="App">
            <div className="header">
                <Header userData={user} />
            </div>
            <div className="body">
                { !auth ? (
                    !tappedCard ? <Arrow /> : <Loader />
                ) : <CafeMenu user={user}/>}
            </div>
        </div>
    );
}