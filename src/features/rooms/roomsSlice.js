import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import roomsData from '../../data/rooms.json';

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (roomsData && roomsData.length > 0) {
        const savedRooms = localStorage.getItem('rooms');
        if (savedRooms) {
          resolve(JSON.parse(savedRooms));
        } else {
          localStorage.setItem('rooms', JSON.stringify(roomsData));
          resolve(roomsData);
        }
      } else {
        reject('No room data found.');
      }
    }, 500);
  });
});

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    setRooms: (state, action) => {
      state.items = action.payload;
      localStorage.setItem('rooms', JSON.stringify(state.items));
    },
    updateRoomStatus: (state, action) => {
      const { roomId, available } = action.payload;
      const room = state.items.find(r => r.id === roomId);
      if (room) {
        room.available = available;
   
        localStorage.setItem('rooms', JSON.stringify(state.items));
      }
    },

    bookRoom: (state, action) => {
      const roomId = action.payload;
      const room = state.items.find(r => r.id === roomId);
      if (room) {
        room.available = false;
  
        localStorage.setItem('rooms', JSON.stringify(state.items));
      }
    },

    cancelBooking: (state, action) => {
      const roomId = action.payload;
      const room = state.items.find(r => r.id === roomId);
      if (room) {
        room.available = true;

        localStorage.setItem('rooms', JSON.stringify(state.items));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setRooms, updateRoomStatus, bookRoom, cancelBooking } = roomsSlice.actions;
export default roomsSlice.reducer;