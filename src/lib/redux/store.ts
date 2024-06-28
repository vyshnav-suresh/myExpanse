import { configureStore } from "@reduxjs/toolkit";
import basicSlice from "./features/basic/basicSlice";
import settingsSlice from "./features/settings/settingsSlice";

export const store = configureStore({
  reducer: {
    // reagent: todosSlice.reducer,
    basic: basicSlice.reducer,
    settings: settingsSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
