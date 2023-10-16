import { combineReducers } from "@reduxjs/toolkit";

// import each reducers
import { reducer as node } from "./node";
import { reducer as login } from "./login";

const rootReducer = combineReducers({
    node,
    login,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;