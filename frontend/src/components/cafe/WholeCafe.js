import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Arrow from "./Arrow";
import Loader from "./Loader";
import CafeMenu from "./CafeMenu";
import { HomeRedirect } from "./HomeRedirect";
import { useGetTokenByNFCMutation, useFetchCafeStatusQuery } from "../../services/apiSlice"; // Импортируем хуки для запросов
import { setCredentials } from '../../services/authSlice';
import { useDispatch } from 'react-redux';

export const WholeCafe = () => {

    const dispatch = useDispatch();

    const [tappedCard, setTappedCard] = useState(false);
    const [auth, setAuth] = useState(null);
    const [user, setUser] = useState("");
    const [error, setError] = useState(false);
    const [isOpenCafe, setIsOpenCafe] = useState(true);

    // получения токена по NFC-карте
    const [getTokenByNFC] = useGetTokenByNFCMutation();

    const { data: cafeStatusData, refetch: refetchCafeStatus } = useFetchCafeStatusQuery(process.env.REACT_APP_EVENT_NAME);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:2000");

        socket.onopen = () => {
            console.log("WebSocket connection opened");
        };

        socket.onmessage = (event) => {
            const card = event.data;
            const pattern = "cardID";

            if (card.includes(pattern)) {
                setTappedCard(true);
                const cardId = card.split(":")[1];
                console.log("card ", cardId);

                setTimeout(() => {
                    getTokenByNFC(cardId)
                      .unwrap()
                      .then((data) => {
                        if (data.error) {
                          console.error("Ошибка при авторизации через NFC:", data.error);
                          setError(true);
                        } else {
                          console.log("Успешная авторизация, данные пользователя:", data);
                          dispatch(setCredentials({ token: data.authToken })); // Сохраняем токен в Redux
                          setAuth(data.authToken);
                          setUser(data.user);
                          setError(false);
                        }
                      })
                      .catch((error) => {
                        console.error("Ошибка при запросе на сервер:", error);
                        setError(true);
                    });
                }, 1000);
            }
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
                console.log("WebSocket connection closed");
            }
        };
    }, [getTokenByNFC]);

    useEffect(() => {
        if (cafeStatusData) {
            setIsOpenCafe(cafeStatusData.status.open);
        }

        const intervalId = setInterval(refetchCafeStatus, 10000);

        return () => clearInterval(intervalId);
    }, [cafeStatusData, refetchCafeStatus]);

    // const handleSimulateNFC = () => {
    //     setTappedCard(true);
    //     const cardId = '04d5dec9780000';
    
    //     if (!cardId) {
    //       console.error("Ошибка: NFC токен пустой");
    //       setError(true);
    //       return;
    //     }
    
    //     console.log("Симуляция поднесения NFC карты, токен:", cardId);
    
    //     setTimeout(() => {
    //       getTokenByNFC(cardId)
    //         .unwrap()
    //         .then((data) => {
    //           if (data.error) {
    //             console.error("Ошибка при авторизации через NFC:", data.error);
    //             setError(true);
    //           } else {
    //             console.log("Успешная авторизация, данные пользователя:", data);
    //             dispatch(setCredentials({ token: data.authToken })); // Сохраняем токен в Redux
    //             setAuth(data.authToken);
    //             setUser(data.user);
    //             setError(false);
    //           }
    //         })
    //         .catch((error) => {
    //           console.error("Ошибка при запросе на сервер:", error);
    //           setError(true);
    //         });
    //     }, 1000);
    //   };
    

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
                            {!auth ? (
                                !tappedCard ? <Arrow /> : <Loader />
                            ) : (
                                <CafeMenu 
                                    user={user}
                                    updateBalance={setUser} 
                                    auth={auth}
                                />
                            )}
                        </div>
                    </div>
                 : 
                    <h1 className="2xl:container md:text-4xl sm:text-2xl mt-20 text-center">Cafe is closed</h1>
                )
             : 
                <>
                    <h1 className="2xl:container md:text-4xl sm:text-2xl mt-20 text-center">User not found</h1>
                    <div className="absolute bottom-10 left-20 z-50">
                        <HomeRedirect />
                    </div>
                </>
            }
        </div>
    );
};
