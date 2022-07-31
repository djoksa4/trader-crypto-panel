import { createSlice } from "@reduxjs/toolkit";

const dataSlice = createSlice({
  name: "data",
  initialState: {
    pairs: [],
    isLoggedIn: false,
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
      state.pairs.forEach((pair) => {
        if (pair.pair === action.payload) {
          pair.fav = !pair.fav;
        }
      });
    },

    onLogin(state) {
      state.isLoggedIn = true;
      localStorage.setItem("userLoggedIn", 1);
    },
  },
});

export const dataActions = dataSlice.actions;
export default dataSlice;
