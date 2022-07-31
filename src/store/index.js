import { configureStore } from "@reduxjs/toolkit";

import dataSlice from "./data-slice";

const store = configureStore({
  reducer: {
    data: dataSlice.reducer,
  },
  devTools: true,
});

export default store;
