export const onlineString = (ago) => {
  const dateTable = {
    dateStrings: ['min', 'hour', 'day', 'week', 'month', 'year'],
    containsSeconds: [60, 3600, 86400, 597800, 17934000, 215208000],
  };
  if (ago < 60) {
    return 'less than a minute';
  } else if (ago > 215208000) {
    return 'more than a year';
  } else {
    for (let i = 0; i < dateTable.containsSeconds.length - 1; i++) {
      const low = dateTable.containsSeconds[i];
      const high = dateTable.containsSeconds[i + 1];
      if (ago < high) {
        const rounded = Math.floor(ago / low);
        if (rounded === 1) {
          return `1 ${dateTable.dateStrings[i]}`;
        } else {
          return `${rounded} ${dateTable.dateStrings[i]}s`;
        }
      }
    }
  }
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

    const lastMessage1 =
      chat1.messages.length === 0
        ? undefined
        : chat1.messages[chat1.messages.length - 1];
    const lastMessage2 =
      chat2.messages.length === 0
        ? undefined
        : chat1.messages[chat1.messages.length - 1];

    const lastMessageTime1 = lastMessage1
      ? lastMessage1.sentDateTime
      : emptyChatDate;
    const lastMessageTime2 = lastMessage2
      ? lastMessage2.sentDateTime
      : emptyChatDate;

    return -(Date.parse(lastMessageTime1) - Date.parse(lastMessageTime2));
  });
};
