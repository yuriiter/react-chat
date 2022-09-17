import {createStore} from "redux";

const initialState = {
    mobileNavOpen: true,
    isChatOpen: false,
    chatId: null
}

const reducerFn = (state = initialState, action) => {
    if(action.type === "TOGGLE_MOBILENAVOPEN") {
        return {...state, mobileNavOpen: !state.mobileNavOpen}
    }

    if(action.type === "OPEN_CHAT") {
        return {...state, isChatOpen: true, chatId: action.payload}
    }
    if(action.type === "CLOSE_CHAT") {
        return {...state, isChatOpen: false, chatId: null}
    }



    return state
}

export const store = createStore(reducerFn);