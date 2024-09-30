import React, { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import Header from "../header/Header";
import { OrderTablesWithTabs } from "./OrderTablesWithTabs";
import Button from "../common/Button";
import { useFetchOrdersQuery, useToggleCafeMutation, useClearOrderHistoryMutation, useFetchCafeStatusQuery, useCompleteOrderMutation, useSignInMutation } from '../../services/apiSlice';
import { useDispatch } from 'react-redux'; 
import { setCredentials } from '../../services/authSlice'; // для установки токена при авторизации

const ADMIN_LOGIN = process.env.REACT_APP_ADMIN_USER_LOGIN;
const ADMIN_PASSWORD = process.env.REACT_APP_ADMIN_USER_PASSWORD;

export const OrdersTable = () => {
  const [auth, setAuth] = useState('');
  const [cookie, setCookie] = useCookies(['authToken']);
  const [isOpenCafe, setIsOpenCafe] = useState();


  // Запрос для получения заказов через RTK Query
  const { data: ordersData, refetch: refetchOrders } = useFetchOrdersQuery();
  // Запрос для получения статуса кафе
  const { data: cafeStatusData, refetch: refetchCafeStatus } = useFetchCafeStatusQuery();
  const [toggleCafe] = useToggleCafeMutation();
  const [clearHistory] = useClearOrderHistoryMutation();
  const [completeOrder] = useCompleteOrderMutation();
  const [signIn] = useSignInMutation();

  const dispatch = useDispatch(); 

  useEffect(() => {
    if (cookie.authToken) {
      setAuth(cookie.authToken);
      dispatch(setCredentials({ token: cookie.authToken })); // Устанавливаем токен в Redux
    }
  }, [cookie.authToken, dispatch]);

  useEffect(() => {
    if (auth) {
      const intervalId = setInterval(() => {
        refetchOrders();
      }, 10000);
      return () => clearInterval(intervalId);
    }
  }, [auth, refetchOrders]);

  useEffect(() => {
    if (cafeStatusData) {
      setIsOpenCafe(cafeStatusData.status.open);
    }
  }, [cafeStatusData]);

  const handleSignIn = async () => {
    if (!auth) {
      const response = await signIn({
        email: ADMIN_LOGIN, 
        password: ADMIN_PASSWORD,
      });
      if (response.data) {
        setCookie('authToken', response.data.token, { path: '/', expires: new Date(Date.now() + 3600000) });
        setAuth(response.data.token); 
        dispatch(setCredentials({ token: response.data.token })); //  токен в Redux
      }
    }
  };

  const handleClose = async () => {
    await toggleCafe();
    refetchCafeStatus();
  };

  const handleComplete = async (id) => {
    await completeOrder(id);
    refetchOrders();
  };

  const handleClearHistory = async () => {
    await clearHistory();
    refetchOrders();
  };

  return (
    <>
      <div className="header">
        <Header />
      </div>
      <div className="orders-table">
        {!auth ? (
          <div className="w-full text-center">
            <Button handleClick={handleSignIn} text={"Sign In"} /> {/* Кнопка для авторизации */}
          </div>
        ) : (
          <OrderTablesWithTabs
            orders={ordersData ? ordersData.orders : []}
            completeOrder={handleComplete}
            statusCafe={isOpenCafe}
            toggleCafe={handleClose} // Метод открытия/закрытия кафе
            clearHistory={handleClearHistory}
          />
        )}
      </div>
    </>
  );
};
