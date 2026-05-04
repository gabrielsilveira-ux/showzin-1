import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import authReducer from "./auth";
import userReducer from "./user";

const createNoopStorage = () => ({
  getItem: async () => null,
  setItem: async (_key: string, value: string) => value,
  removeItem: async () => undefined,
});

const storage =
  typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage();

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["isLoading", "isError", "isLoaded"],
};

const userPersistConfig = {
  key: "user",
  storage,
  blacklist: ["isLoading", "isError", "isLoaded"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
