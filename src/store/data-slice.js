import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    pairs: [],
    isLoggedIn: false,
    favorites: [],
  },
  reducers: {
    onSubsrcibe(state, action) {
      const newEntry = action.payload;

      const existingEntry = state.pairs.find(
        (pair) => pair.channelId === newEntry.channelId
      );

      if (!existingEntry) {
        state.pairs.push(newEntry);
      }
    },

    update(state, action) {
      state.pairs.forEach((pair) => {
        if (pair.channelId === action.payload.channelId) {
          pair.lastPrice = action.payload.lastPrice;
          pair.dailyChange = action.payload.dailyChange;
          pair.dailyChangePercent = action.payload.dailyChangePercent;
          pair.dailyHigh = action.payload.dailyHigh;
          pair.dailyLow = action.payload.dailyLow;
        }
      });
    },

    toggleFav(state, action) {
      if (state.favorites.includes(action.payload)) {
        // already favorited -> remove from favorites
        state.favorites = state.favorites.filter(
          (pair) => pair !== action.payload
        );
      } else {
        // not favorited -> add to favorites
        state.favorites.push(action.payload);
      }
    },

    loadFavorites(state, action) {
      state.favorites = action.payload;
    },

    onLogin(state) {
      state.isLoggedIn = true;
    },
  },
});

export const dataActions = dataSlice.actions;
export default dataSlice;
