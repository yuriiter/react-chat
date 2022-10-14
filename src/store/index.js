import {createStore} from "redux";
import {getRemoteUser} from "../utils";

const initialState = {
    mobileNavOpen: false,
    isChatOpen: false,
    chats: [],
    chat: {},
    user: {},
    currentTime: Date.now(),
    accessToken: localStorage.getItem("accessToken")
}

const reducerFn = (state = initialState, action) => {
    if(action.type === "TOGGLE_MOBILENAVOPEN") {
        return {...state, mobileNavOpen: !state.mobileNavOpen}
    }
    
    if(action.type === "OPEN_CHAT") {
        const chatId = action.payload;
        const searchedChats = state.chats.filter(chat => chat.id === chatId && chat.active)
        if(searchedChats.length > 0) {
            return state;
        }

        let pickedChat = null;
        const newChats = state.chats.map(chat => {
            let active = false
            if(chat.id === action.payload) {
                active = true;
                pickedChat = chat;
                pickedChat.active = true;
            }
            return { ...chat, active: active}
        });

        return {...state, isChatOpen: true, chats: newChats, chat: { ...pickedChat } }
    }
    
    if(action.type === "CLOSE_CHAT") {
        return {...state, isChatOpen: false, chatId: null}
    }
    if(action.type === "SET_USER") {
        return {...state, user: action.payload}
    }
    if(action.type === "SET_ACCESS_TOKEN") {
        console.log(action.payload)
        if(action.payload === null) {
            localStorage.removeItem("accessToken")
        }
        else {
            localStorage.setItem("accessToken", action.payload)
        }
        return {...state, accessToken: action.payload}
    }
    if(action.type === "SET_CHATS") {
        const chats = action.payload;
        const newChats = chats.map(chat => {
            const remoteUser = getRemoteUser(state.user.id, chat.users);
            const lastOnline = remoteUser.lastOnline;
            const status = Date.parse(lastOnline) > Date.now() ? "ONLINE" : "LAST_ONLINE";
            return { ...chat, active: false, status: status}
        });
        return {...state, chats: newChats}
    }
    if(action.type === "ADD_CHAT") {
        const newChat = action.payload;
        const chats = state.chats;
        const chatAlreadyExists = chats.filter(chat => chat.id === newChat.id);
        if(chatAlreadyExists.length > 0) {
            return state;
        }
        
        const remoteUser = getRemoteUser(state.user.id, newChat.users);
        const lastOnline = remoteUser.lastOnline;
        const status = Date.parse(lastOnline) > Date.now() ? "ONLINE" : "LAST_ONLINE";
        
        newChat.active = false;
        newChat.status = status;
        
        
        return {...state, chats: [ ...state.chats, newChat ]}
    }
    if(action.type === "ADD_MESSAGE") {
        const chatId = action.payload.chatId;
        /* const message = action.payload. */
    }

    if(action.type === "UPDATE_GLOBAL_TIMER") {
        return {...state, currentTime: Date.now()}
    }


    return state
}

export const store = createStore(reducerFn);
