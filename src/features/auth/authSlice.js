import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  users: JSON.parse(localStorage.getItem('users')) || [], 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signUp: (state, action) => {
      const newUser = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString()
      };
      state.users.push(newUser);
      localStorage.setItem('users', JSON.stringify(state.users));
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('currentUser');
    },
    checkAuth: (state) => {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        state.isAuthenticated = true;
        state.user = JSON.parse(currentUser);
      }
    }
  }
});

export const { signUp, login, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;