import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './reducer/auth.reducer';
import { sessionReducer } from './reducer/user.reducer';
const initialState = {
    auth: { loading: true },
};

export const store =  configureStore({
    reducer: {
        auth: authReducer,
        session: sessionReducer
    },
    preloadedState: initialState
});