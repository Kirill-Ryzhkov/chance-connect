import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null, // Изначальное состояние — токен отсутствует
};

// Создаем slice для управления авторизацией
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload.token; // Сохраняем токен после авторизации
    },
    logout: (state) => {
      state.token = null; // Удаляем токен при выходе
    },
  },
});

// Экспортируем действия для использования в компонентах
export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
