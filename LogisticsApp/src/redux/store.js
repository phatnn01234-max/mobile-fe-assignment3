// src/redux/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';
import orderReducer from './orderSlice'; // Thêm dòng này

const rootReducer = combineReducers({
    auth: authReducer,
    orders: orderReducer // Thêm dòng này
});

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['auth'], // LƯU Ý QUAN TRỌNG CHỖ NÀY
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);