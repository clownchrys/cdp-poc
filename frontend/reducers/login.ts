import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* State */

export type LoginState = {
    isLogin: boolean
}

/* Payloads */

export type LoginPayload = {}
export type LogoutPayload = {}

/* Actions, Reducer */

export const {actions, reducer} = createSlice({
    name: "login",

    initialState: { isLogin: false } as LoginState,

    reducers: {
        login(state, action: PayloadAction<LoginPayload>): LoginState {
            return { isLogin: true }
        },

        logout(state, action: PayloadAction<LogoutPayload>): LoginState {
            return { isLogin: false }
        },
    }
})
