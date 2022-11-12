export const onlineString = (dt_) => {
  if (!dt_) return;

  const dt = new Date(Date.parse(dt_));
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const now = new Date();

  const nowDay = now.getDay();
  const nowYear = now.getFullYear();

  const dtDay = dt.getDay();
  const dtMonth = dt.getMonth();
  const dtYear = dt.getFullYear();

  let dtMinutes = dt.getMinutes();
  let dtHours = dt.getHours();

  if (dtHours < 10) {
    dtHours = `0${dtHours}`;
  }
  if (dtMinutes < 10) {
    dtMinutes = `0${dtMinutes}`;
  }

  let timeString = `${dtHours}:${dtMinutes}`;

  if (nowDay !== dtDay) {
    timeString += `, ${dtDay} ${months[dtMonth]}`;
  }
  if (nowYear !== dtYear) {
    timeString += `, ${dtYear}`;
  }

  return timeString;
};

export const isEmailValid = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const isPasswordValid = (password) => {
  if (password.length < 6 || password.length > 20) {
    return false;
  }

  let hasCapitalLetter = false;
  let hasNumber = false;

  for (let i = 0; i < password.length; i++) {
    if (!isNaN(password[i])) {
      hasNumber = true;
    }
    if (
      password[i] !== password[i].toLowerCase() &&
      password[i] === password[i].toUpperCase()
    ) {
      hasCapitalLetter = true;
    }
  }

  return hasCapitalLetter && hasNumber;
};

export const getRemoteUser = (userId, users) => {
  if (!users || !userId) {
    return;
  }
  return users[0]?.id === userId ? users[1] : users[0];
};

export const sortChats = (chats) => {
  const sortedChats = [...chats];
  return sortedChats.sort((chat1, chat2) => {
    const emptyChatDate = new Date();
    emptyChatDate.setDate(emptyChatDate.getDate() + 7);
    const emptyChatTime = emptyChatDate.getTime();

    const lastMessage1 =
      chat1.messages.length === 0
        ? undefined
        : chat1.messages[chat1.messages.length - 1];
    const lastMessage2 =
      chat2.messages.length === 0
        ? undefined
        : chat2.messages[chat2.messages.length - 1];

    const lastMessageTime1 = lastMessage1
      ? Date.parse(lastMessage1.sentDateTime)
      : emptyChatTime;
    const lastMessageTime2 = lastMessage2
      ? Date.parse(lastMessage2.sentDateTime)
      : emptyChatTime;

    return -(lastMessageTime1 - lastMessageTime2);
  });
};

export const mapUnreadMessages = (messages, chat, authorId) => {
  if (!chat || !chat.users || !authorId || !messages) {
    return;
  }

  let countOfNewMessages =
    chat.users[0].id === authorId
      ? chat.countOfNewMessagesToUsers[1]
      : chat.countOfNewMessagesToUsers[0];

  const newMessages = messages.map((m) => {
    return {
      ...m,
      isMessageRead: true,
    };
  });
  for (let i = newMessages.length - 1; i >= 0; i--) {
    if (countOfNewMessages === 0) {
      break;
    }

    const currentMessage = newMessages[i];
    if (currentMessage.authorId === authorId) {
      currentMessage.isMessageRead = false;
      countOfNewMessages--;
    }
  }
  return newMessages;
};

export const displaySize = (byteLength) => {
  if (!byteLength) {
    return;
  }

  const denotions = ['B', 'KB', 'MB'];
  const checks = [
    byteLength < 1024,
    byteLength >= 1024 && byteLength < 1024 * 1024,
    byteLength >= 1024 * 1024,
  ];
  const dividers = [1, 1024, 1024 * 1024];

  const idx = checks.indexOf(true);

  if (!idx) {
    return;
  }

  return Math.round((byteLength * 100) / dividers[idx]) / 100 + denotions[idx];
};
