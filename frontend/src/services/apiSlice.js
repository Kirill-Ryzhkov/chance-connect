import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URI = process.env.REACT_APP_BACKEND_API_URI;
const EVENT_NAME = process.env.REACT_APP_EVENT_NAME;

// функция для создания запросов (POST/GET)
const createQuery = (url, method = 'POST', body = null) => ({
  url,
  method,
  ...(body && { body }), // Добавляем body только если он существует
});

export const apiSlice = createApi({
  reducerPath: 'api', 
  baseQuery: fetchBaseQuery({
    baseUrl: API_URI, 
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token; // Получаем токен из состояния
      if (token) {
        headers.set('Authorization', `Bearer ${token}`); 
      }
      return headers;
    },
  }),
  tagTypes: ['Orders', 'CafeStatus'], 
  endpoints: (builder) => ({
    // Мутация для создания нового заказа
    createOrder: builder.mutation({
      query: (orderData) => createQuery('/order', 'POST', orderData),
    }),
    // Запрос для получения списка заказов
    fetchOrders: builder.query({
      query: () => createQuery('/order', 'GET'),
      providesTags: ['Orders'],
    }),
    // Мутация для завершения заказа (по его ID)
    completeOrder: builder.mutation({
      query: (id) => createQuery('/order/complete', 'POST', { order_id: id }),
      invalidatesTags: ['Orders'], // Инвалидируем теги для обновления данных
    }),
    // Мутация для обработки платежа
    processPayment: builder.mutation({
      query: (paymentData) => createQuery('/order/payment', 'POST', paymentData),
    }),
    // Мутация для открытия/закрытия кафе (на основе события)
    toggleCafe: builder.mutation({
      query: () => createQuery(`/event/toggleCafe/${EVENT_NAME}`, 'GET'),
      invalidatesTags: ['CafeStatus'], // Инвалидируем статус кафе для обновления данных
    }),
    // Запрос для получения статуса кафе (открыто/закрыто)
    fetchCafeStatus: builder.query({
      query: () => createQuery(`/event/statusCafe/${EVENT_NAME}`, 'GET'),
      providesTags: ['CafeStatus'],
    }),
    // Мутация для очистки истории заказов
    clearOrderHistory: builder.mutation({
      query: () => createQuery('/order/clear', 'POST'),
      invalidatesTags: ['Orders'], // Инвалидируем теги для обновления списка заказов
    }),
    // Мутация для авторизации пользователя
    signIn: builder.mutation({
      query: ({ email, password }) => createQuery('/user/signin', 'POST', { email, password }),
    }),
    // Мутация для выхода пользователя из системы
    logout: builder.mutation({
      query: () => createQuery('/user/logout', 'POST'),
    }),
    // Запрос для получения статуса всех заказов (используется для обновления заказов)
    fetchOrdersStatus: builder.query({
      query: () => createQuery('/order', 'GET'),
      providesTags: ['Orders'], // Используем тег для обновления данных заказов
    }),
    // Мутация для получения токена пользователя через NFC (по ID NFC карты)
    getTokenByNFC: builder.mutation({
      query: (cardId) => createQuery('/user/get-token', 'POST', { nfc_id: cardId }),
    }),
  }),
});

export const {
  useCreateOrderMutation,        // Хук для создания заказа
  useFetchOrdersQuery,           // Хук для получения списка заказов
  useCompleteOrderMutation,      // Хук для завершения заказа
  useProcessPaymentMutation,     // Хук для обработки платежа
  useToggleCafeMutation,         // Хук для открытия/закрытия кафе
  useFetchCafeStatusQuery,       // Хук для получения статуса кафе
  useClearOrderHistoryMutation,  // Хук для очистки истории заказов
  useSignInMutation,             // Хук для авторизации пользователя
  useLogoutMutation,             // Хук для выхода пользователя из системы
  useFetchOrdersStatusQuery,     // Хук для получения статуса всех заказов
  useGetTokenByNFCMutation       // Хук для получения токена пользователя через NFC
} = apiSlice;
