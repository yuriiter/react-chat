import { createStore } from 'redux';
import { getRemoteUser, sortChats } from '../utils';

const initialState = {
  mobileNavOpen: false,
  isChatOpen: false,
  chats: [],
  messages: [],
  chat: {},
  user: {},
  currentTime: Date.now(),
  snackBarMessageType: null,
};

const reducerFn = (state = initialState, action) => {
  if (action.type === 'TOGGLE_MOBILENAVOPEN') {
    return { ...state, mobileNavOpen: !state.mobileNavOpen };
  }

  if (action.type === 'OPEN_CHAT') {
    const chatId = action.payload;
    const searchedChats = state.chats.filter(
      (chat) => chat.id === chatId && chat.active,
    );
    if (searchedChats.length > 0) {
      return { ...state, isChatOpen: true };
    }

    let pickedChat = null;
    const newChats = state.chats.map((chat) => {
      let active = false;
      if (chat.id === action.payload) {
        active = true;
        pickedChat = chat;
        pickedChat.active = true;
      }
      return { ...chat, active: active };
    });

    return {
      ...state,
      isChatOpen: true,
      chats: newChats,
      chat: { ...pickedChat },
    };
  }

  if (action.type === 'CLOSE_CHAT') {
    const newChats = state.chats.map((chat) => {
      return { ...chat, active: false };
    });
    return { ...state, isChatOpen: false, chat: {}, chats: newChats };
  }
  if (action.type === 'SET_USER') {
    return { ...state, user: action.payload };
  }

  if (action.type === 'SET_CHATS') {
    const chats = action.payload || state.chats;
    if (!state.user.id) {
      return state;
    }
    const newChats = chats.map((chat) => {
      const remoteUser = getRemoteUser(state.user.id, chat.users);
      const lastOnline = remoteUser.lastOnline;
      const status =
        Date.parse(lastOnline) > Date.now() ? 'ONLINE' : 'LAST_ONLINE';
      const newChat = { ...chat, active: false, status: status };
      return newChat;
    });
    return { ...state, chats: sortChats(JSON.parse(JSON.stringify(newChats))) };
  }
  if (action.type === 'ADD_CHAT') {
    const newChat = action.payload;
    const chats = state.chats;
    const chatAlreadyExists = chats.filter((chat) => chat.id === newChat.id);
    if (chatAlreadyExists.length > 0) {
      return state;
    }

    const remoteUser = getRemoteUser(state.user.id, newChat.users);
    const lastOnline = remoteUser.lastOnline;
    const status =
      Date.parse(lastOnline) > Date.now() ? 'ONLINE' : 'LAST_ONLINE';

    newChat.active = false;
    newChat.status = status;

    return { ...state, chats: sortChats([...state.chats, newChat]) };
  }

  if (action.type === 'ADD_MESSAGE') {
    const { message } = action.payload;
    const chatId = message.chatId;
    const chats = state.chats;
    const chat = chats.find((chat) => chat.id === chatId);
    if (!chat) {
      return state;
    }

    chat.messages.push(message);

    const countOfNewMessagesToUsers = chat.countOfNewMessagesToUsers;
    if (chat.users[0].id === message.authorId) {
      countOfNewMessagesToUsers[1] += 1;
    } else {
      countOfNewMessagesToUsers[0] += 1;
    }

    if (state.chat?.id === chatId) {
      return {
        ...state,
        chats: sortChats(JSON.parse(JSON.stringify(chats))),
        chat: JSON.parse(JSON.stringify(chat)),
      };
    }
    return {
      ...state,
      chats: sortChats(JSON.parse(JSON.stringify(chats))),
    };
  }

  if (action.type === 'CHANGE_STATUS') {
    const { newStatus, chatId } = action.payload;
    const userChat = state.chats.find((chat) => chat.id === chatId);

    if (!userChat) {
      return state;
    }

    userChat.status = newStatus;
    if (newStatus === 'LAST_ONLINE') {
      const remoteUser = getRemoteUser(state.user.id, userChat.users);
      remoteUser.lastOnline = new Date();
    }

    if (userChat.id === state.chat.id) {
      return {
        ...state,
        chats: JSON.parse(JSON.stringify(state.chats)),
        chat: JSON.parse(JSON.stringify(userChat)),
      };
    }

    return { ...state, chats: JSON.parse(JSON.stringify(state.chats)) };
  }

  if (action.type === 'READ_MESSAGES') {
    const { chatId, countOfNewMessagesToUsers } = action.payload;
    const chat = state.chats.find((chat) => chat.id === chatId);
    chat.countOfNewMessagesToUsers = countOfNewMessagesToUsers;
    if (state.chat?.id === chat.id) {
      return {
        ...state,
        chats: JSON.parse(JSON.stringify(state.chats)),
        chat: JSON.parse(JSON.stringify(chat)),
      };
    }
    return { ...state, chats: JSON.parse(JSON.stringify(state.chats)) };
  }

  if (action.type === 'UPDATE_GLOBAL_TIMER') {
    return { ...state, currentTime: Date.now() };
  }

  if (action.type === 'SET_SNACKBAR') {
    return {
      ...state,
      snackBarMessage: action.payload.snackBarMessage,
      snackBarMessageType: action.payload.snackBarMessageType,
    };
  }

  return state;
};

export const store = createStore(reducerFn);
