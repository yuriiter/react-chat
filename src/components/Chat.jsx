import React, { Component } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';

import { getRemoteUser, mapUnreadMessages } from '../utils';

import UserStatus from './UserStatus';
import Message from './Message';

import IconFileInChat from '../icon_components/IconFileInChat';

import avatarImage from '../assets/img/avatar_image.jpg';
import iconAttachment from '../assets/img/icon_attachment.svg';
import iconPoints from '../assets/img/icon_points.svg';
import iconPlus from '../assets/img/icon_plus.svg';
import iconAttachImage from '../assets/img/icon_attach_image.svg';
import iconSend from '../assets/img/icon_send.svg';
import iconArrowLeft from '../assets/img/icon_arrow_left.svg';

/* const messagesPerPage = 15; */

class Chat extends Component {
  state = {
    attachmentsButtonOpen: false,
    scrollFromTop: null,
    messages: [],
    chatInput: '',
  };

  chatIdsToStatusTimeouts = [];
  messageContainerRef = React.createRef(null);

  socketOptions = {
    transportOptions: {
      polling: {
        extraHeaders: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      },
    },
  };
  socket = io(process.env.REACT_APP_BACKEND_API_URL, this.socketOptions);

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.sendTextMessage();
    }
  };
  handleMessageContainerScroll = (e) => {
    this.setState({ scrollFromTop: e.target.scrollTop });
  };

  componentDidMount() {
    this.setState({
      scrollFromTop: this.messageContainerRef.current.scrollTop,
    });

    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });
    this.socket.on('onMessage', (newMessage) => {
      if (newMessage.chatId === this.props.chat.id) {
        this.setState(
          (prevState) => {
            return {
              messages: mapUnreadMessages(
                [...prevState.messages, newMessage],
                this.props.chat,
                this.props.user.id,
              ),
            };
          },
          () => {
            this.props.dispatch({
              type: 'ADD_MESSAGE',
              payload: { message: newMessage },
            });
          },
        );
      } else {
        this.props.dispatch({
          type: 'ADD_MESSAGE',
          payload: { message: newMessage },
        });
      }
    });

    this.socket.on('statusOfUsers', (status) => {
      if (status.newStatus === 'WRITING' || status.newStatus === 'RECORDING') {
        const chatId = this.props.chat.id;
        const objToClear = this.chatIdsToStatusTimeouts.find(
          (el) => el.chatId === chatId,
        );
        if (objToClear) {
          const timeout = objToClear.timeout;
          clearTimeout(timeout);
          this.chatIdsToStatusTimeouts = this.chatIdsToStatusTimeouts.filter(
            (el) => el.chatId !== chatId,
          );
        }
        const chat = this.props.chats.find((chat) => chat.id === status.chatId);
        if (chat) {
          this.props.dispatch({ type: 'CHANGE_STATUS', payload: status });
          const newTimeout = setTimeout(() => {
            let returnStatus;
            if (chat.status === 'LAST_ONLINE') {
              returnStatus = 'LAST_ONLINE';
            } else {
              returnStatus = 'ONLINE';
            }
            this.props.dispatch({
              type: 'CHANGE_STATUS',
              payload: { newStatus: returnStatus, chatId: chat.id },
            });
          }, 500);

          this.chatIdsToStatusTimeouts.push({
            chatId: chatId,
            timeout: newTimeout,
          });
        }
      } else if (
        status.newStatus === 'ONLINE' ||
        status.newStatus === 'LAST_ONLINE'
      ) {
        this.props.dispatch({ type: 'CHANGE_STATUS', payload: status });
      }
    });

    this.socket.on('readMessages', (readMessagesData) => {
      this.props.dispatch({ type: 'READ_MESSAGES', payload: readMessagesData });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chat !== this.props.chat) {
      if (this.props.chat.id) {
        fetch(
          process.env.REACT_APP_BACKEND_API_URL +
            `/chats/${this.props.chat.id}/messages?take=100000`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.props.accessToken}`,
            },
          },
        )
          .then((response) => response.json())
          .then((json) => {
            const statusCode = json.statusCode;

            if (statusCode) {
              if (statusCode === 401) {
                this.props.dispatch({
                  type: 'SET_SNACKBAR',
                  payload: {
                    snackBarMessage: 'Unauthorized',
                    snackBarMessageType: 'error',
                  },
                });
                this.setState({ navigate: '/signin' });
              }
            } else {
              if (this.props.chat.id !== prevProps.chat.id) {
                this.socket.emit('readChat', { chatId: this.props.chat.id });
              } else if (
                this.props.chat.messages.length >
                  prevProps.chat.messages.length &&
                this.props.chat.messages[this.props.chat.messages.length - 1]
                  .authorId !== this.props.user.id &&
                this.props.chat.id === prevProps.chat.id &&
                this.props.isChatOpen
              ) {
                this.socket.emit('readChat', { chatId: this.props.chat.id });
              }
              this.setState(
                {
                  messages: mapUnreadMessages(
                    json,
                    this.props.chat,
                    this.props.user.id,
                  ),
                },
                () => {
                  this.messageContainerRef.current.scrollTo(
                    0,
                    this.messageContainerRef.current.scrollHeight,
                  );
                },
              );
            }
          });
      }
    }

    if (prevState.messages !== this.state.messages) {
      if (prevState.messages) {
        /* this.socket.emit('readChat', { chatId: this.props.chat.id}); */
        const currentMessagesCount = this.state.messages.length;
        const newMessage = this.state.messages[currentMessagesCount - 1];
        if (newMessage?.authorId === this.props.user.id) {
          this.messageContainerRef.current.scrollTo(
            0,
            this.messageContainerRef.current.scrollHeight,
          );
        } else {
          if (
            this.messageContainerRef.current.scrollHeight -
              this.messageContainerRef.current.offsetHeight -
              this.state.scrollFromTop <
            300
          ) {
            this.messageContainerRef.current.scrollTo(
              0,
              this.messageContainerRef.current.scrollHeight,
            );
          }
        }
      }
    }
  }

  componentWillUnmount() {
    this.socket.off('onMessage');
    this.socket.off('statusOfUsers');
    this.socket.off('readMessages');
    this.socket.off('connect');

    this.chatIdsToStatusTimeouts.forEach((item) => clearTimeout(item.timout));
  }

  handleChatInputChange = (e) => {
    this.socket.emit('newStatus', {
      newStatus: 'WRITING',
      receiverId: this.remoteUser.id,
    });
    this.setState({ chatInput: e.target.value });
  };

  toggleAttachmentsButtonOpen = () =>
    this.setState({ attachmentsButtonOpen: !this.state.attachmentsButtonOpen });

  closeChat = () => this.props.dispatch({ type: 'CLOSE_CHAT' });

  sendTextMessage = () => {
    if (this.state.chatInput.trim().length === 0) {
      this.setState({ chatInput: '' });
      return;
    }

    /* console.log(this.remoteUser.id, ) */
    this.socket.emit('newMessage', {
      receiverId: this.remoteUser.id,
      chatId: this.props.chat.id,
      messageType: 'TEXT',
      messageContent: this.state.chatInput,
    });
    this.setState({ chatInput: '' });
  };

  render() {
    /* const content = 'https://google.com'; */
    /* const file = { */
    /*   download: 'https://google.com', */
    /* }; */
    /* const isUserDefined = */
    /* JSON.stringify(this.props.chat) === JSON.stringify({}); */

    this.remoteUser = getRemoteUser(
      this.props.user?.id,
      this.props.chat?.users,
    );

    return (
      <div className={'chat-messages'}>
        <div className="chat-messages__shadow"></div>
        <div className="chat-messages__container">
          <div className="chat-messages__top">
            <div className="chat-list__list-item__user">
              <img
                src={iconArrowLeft}
                className={'chat-messages__back-button'}
                onClick={this.closeChat}
                alt="Close chat"
              />
              <div className="chat-list__list-item__user-avatar">
                <img src={avatarImage} alt="User avatar" />
                {getRemoteUser(
                  this.props.user?.id,
                  this.props.chat?.users?.fullName,
                )?.status === 'ONLINE' ? (
                  <div className="online-status"></div>
                ) : null}
              </div>
              <div className="chat-list__list-item__user-text">
                <h3 className="chat-list__list-item__user-name">
                  {this.remoteUser?.fullName}
                </h3>
                <span className="chat-list__list-item__user-status">
                  <UserStatus
                    status={this.props.chat.status}
                    dt={this.remoteUser?.lastOnline}
                  />
                </span>
              </div>
            </div>

            <div className="chat-messages__buttons">
              <div className="chat-messages__button chat-messages__buttons__attachment">
                <img src={iconAttachment} alt="Attach a file" />
              </div>
              <div className="chat-messages__button chat-messages__buttons__options">
                <img src={iconPoints} alt="Options" />
              </div>
            </div>
          </div>

          <div
            className="chat-messages__messages"
            ref={this.messageContainerRef}
            onScroll={this.handleMessageContainerScroll}
          >
            {this.state.messages?.map((message) => {
              return <Message key={message.id} message={message} />;
            })}
            {/* <Message isMessagePartners={false} ago={1000} messageType={"FILE"} content={file}/> */}
            {/* <Message isMessagePartners={false} ago={1000} messageType={"RECORDING"} content={content}/> */}
            {/* <Message isMessagePartners={false} ago={1000} messageType={"IMAGE"} content={content}/> */}
          </div>

          <div className="chat-messages__input" onClick={this.focusInput}>
            <div
              className={
                'chat-messages__input__attach' +
                (this.state.attachmentsButtonOpen
                  ? ' chat-messages__input__attach--active'
                  : '')
              }
            >
              <span className="chat-messages__input__attach-inside chat-messages__input__attach-inside--2 chat-messages__input__round-button">
                <img
                  src={iconAttachImage}
                  alt="Attachment"
                  style={{ width: '18px', height: '18px' }}
                />
              </span>
              <span className="chat-messages__input__attach-inside chat-messages__input__attach-inside--1 chat-messages__input__round-button">
                <IconFileInChat color={'#fff'} />
              </span>

              <span
                className="chat-messages__input__attach-open chat-messages__input__round-button"
                onClick={this.toggleAttachmentsButtonOpen}
              >
                <img src={iconPlus} alt="Open buttons" />
              </span>
            </div>

            <div className="chat-messages__input__input">
              <input
                type="text"
                placeholder={' '}
                value={this.state.chatInput}
                onChange={this.handleChatInputChange}
                onKeyDown={this.handleKeyDown}
              />
              <span className="chat-messages__input__placeholder">
                Type a message
              </span>
            </div>

            <span
              className="chat-messages__input__send chat-messages__input__round-button"
              onClick={this.sendTextMessage}
            >
              <img alt="Send a message" src={iconSend} />
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    chats: state.chats,
    chat: state.chat,
    user: state.user,
    currentTime: state.currentTime,
    accessToken: state.accessToken,
    isChatOpen: state.isChatOpen,
  };
};
export default connect(mapStateToProps)(Chat);
