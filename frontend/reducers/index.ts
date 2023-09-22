import { combineReducers } from "@reduxjs/toolkit";

// import each reducers
import { reducer as node } from "./node";

const rootReducer = combineReducers({
    node,
})

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;