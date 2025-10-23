import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: JSON.parse(localStorage.getItem('reservations')) || [],
};

const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    addReservation: (state, action) => {
      const newReservation = {
        id: Date.now().toString(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newReservation);

      localStorage.setItem('reservations', JSON.stringify(state.items));
    },
    removeReservation: (state, action) => {
      state.items = state.items.filter(
        (reservation) => reservation.id !== action.payload
      );
  
      localStorage.setItem('reservations', JSON.stringify(state.items));
    },

    loadReservations: (state) => {
      const saved = localStorage.getItem('reservations');
      if (saved) {
        state.items = JSON.parse(saved);
      }
    },
  },
});

export const { addReservation, removeReservation, loadReservations } = reservationsSlice.actions;
export default reservationsSlice.reducer;