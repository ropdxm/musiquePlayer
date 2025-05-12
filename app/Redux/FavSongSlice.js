"use client"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const SERVER_URL="https://nfacserver.vercel.app";

export const fetchFavorites = createAsyncThunk(
  'favorites/fetch',
  async () => {
    const response = await fetch(`${SERVER_URL}/favorites`);
    return await response.json();
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/add',
  async (songId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER_URL}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      });
    console.log("addFavourite", response.json());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFavorite = createAsyncThunk(
  'favorites/remove',
  async (songId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${SERVER_URL}/favorites/${songId}`, {
        method: 'DELETE',
      });
      console.log("removeFavourite", response.json());
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
    name:[], // indexes of the songs
    NowPlay:false,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
}

export const FavSongSlice = createSlice({
    name:"Favsong",
    initialState,
    reducers:{
        addsong: (state,action) => {
                state.name.push(action.payload)
        },
        removesong : (state,action) => {
                state.name = state.name.filter((ele,index)=> ele != action.payload)
        },
        GoableSongPlay : (state,action) => {
                state.NowPlay = action.payload
        }
    },
    extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.name = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Add favorite
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.name = action.payload;
      })
      
      // Remove favorite
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.name = action.payload;
      });
    }
})

export default  FavSongSlice.reducer
export const  { addsong,GoableSongPlay , removesong } = FavSongSlice.actions