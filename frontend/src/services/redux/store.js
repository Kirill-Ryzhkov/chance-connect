import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../apiSlice'; // Импортируем apiSlice для работы с запросами
import authReducer from '../authSlice'; // Импортируем authReducer для работы с авторизацией

// Настраиваем Redux Store
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer, // Добавляем apiSlice в корневой редьюсер
    auth: authReducer, // Добавляем редьюсер для управления токеном авторизации
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Добавляем middleware для RTK Query
});
