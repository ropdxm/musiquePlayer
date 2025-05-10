'use client'

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import SongsList from "../Data/SongsList"
// Async thunk for fetching songs
export const fetchSongs = createAsyncThunk(
  'songs/fetchSongs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/api/songs?encoded=true', {
        headers: {
          'Content-Type': 'application/json',
        }});
        console.log('Raw response:', response); // Debug log

      if (!response.ok) {
        throw new Error('Failed to fetch songs');
      }
      const data = await response.json();
      console.log('Fetched data:', data); // Debug log
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  SongsLists: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

export const SongListSlice = createSlice({
    name:"SongListSlice",
    initialState,
    reducers:{
        setReOrder:(state,action)=>{
            state.SongsLists = action.payload
        }
    },
    extraReducers: (builder) => {
    builder
      .addCase(fetchSongs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSongs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.SongsLists = action.payload;
      })
      .addCase(fetchSongs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
})


export default SongListSlice.reducer
export const { setReOrder} = SongListSlice.actions