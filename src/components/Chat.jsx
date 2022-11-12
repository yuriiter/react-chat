import React, { Component } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';
import axios from 'axios';

import { getRemoteUser, mapUnreadMessages } from '../utils';

import UserStatus from './UserStatus';
import Message from './Message';

import IconFileInChat from '../icon_components/IconFileInChat';
/* import IconMic from '../icon_components/IconMic'; */
import IconPlus from '../icon_components/IconPlus';

import iconAttachment from '../assets/img/icon_attachment.svg';
import iconPoints from '../assets/img/icon_points.svg';
import iconAttachImage from '../assets/img/icon_attach_image.svg';
import iconSend from '../assets/img/icon_send.svg';
import iconArrowLeft from '../assets/img/icon_arrow_left.svg';

const colors = ['#70A9A1', '#FAB3A9', '#DAB6FC', '#C7D66D', '#9ee37d'];
axios.defaults.withCredentials = true;

class Chat extends Component {
  state = {
    attachmentsButtonOpen: false,
    scrollFromTop: null,
    messages: [],
    chatInput: '',
    file: null,
    messageType: 'TEXT',
    loadingMessage: false,
  };

  chatIdsToStatusTimeouts = [];
  messageContainerRef = React.createRef(null);
  fileInputRefs = [];

  constructor() {
    super();
    for (let i = 0; i < 3; i++) {
      this.fileInputRefs.push(React.createRef(null));
    }
  }

  clearFile = () => {
    this.clearFileInputs();
    this.setState({ file: null, messageType: 'TEXT' });
  };

  upload = (file, messageType) => {
    if (file.size < 1 * 1024 * 1024 * 10) {
      if (messageType === 'IMAGE') {
        const fileNameSplitArray = file.name.split('.');
        const extension = fileNameSplitArray[fileNameSplitArray.length - 1];
        const allowedExtensions = ['jpeg', 'jpg', 'gif', 'png'];

        if (allowedExtensions.indexOf(extension) === -1) {
          this.props.dispatch({
            type: 'SET_SNACKBAR',
            payload: {
              snackBarMessage: `Image must have one of the extensions: ${allowedExtensions.join(
                ', ',
              )}`,
              snackBarMessageType: 'error',
            },
          });
        } else {
          this.setState({
            file: file,
            messageType: messageType,
            attachmentsButtonOpen: false,
          });
        }
      } else {
        this.setState({
          file: file,
          messageType: messageType,
          attachmentsButtonOpen: false,
        });
      }
    } else {
      this.props.dispatch({
        type: 'SET_SNACKBAR',
        payload: {
          snackBarMessage: 'File size must be less than 10 MB',
          snackBarMessageType: 'error',
        },
      });
    }
  };

  onFileChange = (e) => {
    this.upload(e.target.files[0], 'FILE');
  };

  onImageChange = (e) => {
    this.upload(e.target.files[0], 'IMAGE');
  };

  onRecordingChange = (e) => {
    this.upload(e.target.files[0], 'RECORDING');
  };

  socket = io(process.env.REACT_APP_BACKEND_API_URL, {
    withCredentials: true,
  });

  handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      this.sendMessage();
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
      console.log(newMessage);
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
    this.socket.on('onMessageBack', (newMessage) => {
      if (newMessage.chatId === this.props.chat.id) {
        this.setState(
          (prevState) => {
            return {
              messages: mapUnreadMessages(
                [...prevState.messages, newMessage],
                this.props.chat,
                this.props.user.id,
              ),
              loadingMessage: false,
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
        axios
          .get(
            process.env.REACT_APP_BACKEND_API_URL +
              `/chats/${this.props.chat.id}/messages?take=100000`,
          )
          .catch((error) => {
            if (!error.response) {
              this.props.dispatch({
                type: 'SET_SNACKBAR',
                payload: {
                  snackBarMessage: 'No connection to the server',
                  snackBarMessageType: 'error',
                },
              });
              return;
            }
            if (!error.response) {
              this.props.dispatch({
                type: 'SET_SNACKBAR',
                payload: {
                  snackBarMessage: 'No connection to the server',
                  snackBarMessageType: 'error',
                },
              });
              return;
            }
            const statusCode = error.response.status;
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
          })
          .then((response) => {
            if (!response) {
              return;
            }
            const json = response.data;

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
    this.socket.off('onMessageBack');
    this.socket.off('connect');

    this.socket.disconnect();

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

  clearFileInputs = () => {
    for (let i = 0; i < 3; i++) {
      if (!this.fileInputRefs[i].current) {
        continue;
      }
      this.fileInputRefs[i].current.value = null;
    }
  };

  sendMessage = () => {
    if (this.state.messageType === 'TEXT') {
      if (this.state.chatInput.trim().length === 0) {
        this.setState({ chatInput: '' });
        return;
      }
    }

    this.socket.emit('newMessage', {
      receiverId: this.remoteUser.id,
      chatId: this.props.chat.id,
      messageType: this.state.messageType,
      messageContent:
        this.state.messageType === 'TEXT' ? this.state.chatInput : undefined,
      file:
        this.state.messageType === 'TEXT'
          ? undefined
          : {
              buffer: this.state.file,
              name: this.state.file.name,
            },
    });
    this.clearFile();
    this.setState({
      file: null,
      chatInput: '',
      loadingMessage: true,
      messageType: 'TEXT',
    });
  };

  renderInputSwitch = (messageType) => {
    switch (messageType) {
      case 'TEXT':
        return 'Type a message';
      case 'FILE':
        return `File ${this.state.file.name}`;
      case 'IMAGE':
        return `Image ${this.state.file.name}`;
      case 'RECORDING':
        return `Recording ${this.state.file.name}`;
      default:
        return 'Type a message';
    }
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
    if (this.remoteUser && this.remoteUser.fullName) {
      this.alias = this.remoteUser.fullName[0] + this.remoteUser.fullName[1];

      this.colorIdx =
        (this.remoteUser.fullName[0].charCodeAt(0) +
          this.remoteUser.fullName[1].charCodeAt(0)) %
        colors.length;
    }

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
              {/* <div className="chat-list__list-item__user-avatar"> */}
              {/*   <img src={avatarImage} alt="User avatar" /> */}
              {/*   {getRemoteUser( */}
              {/*     this.props.user?.id, */}
              {/*     this.props.chat?.users?.fullName, */}
              {/*   )?.status === 'ONLINE' ? ( */}
              {/*     <div className="online-status"></div> */}
              {/*   ) : null} */}
              {/* </div> */}
              <div className="chat-list__list-item__user-avatar">
                <div
                  alt=""
                  className="avatar__image avatar__image--navigation chat-list__user-avatar__image"
                  style={
                    this.alias
                      ? {
                          backgroundColor: colors[this.colorIdx],
                        }
                      : {}
                  }
                >
                  <span>{this.alias}</span>
                </div>
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

            <div
              className={
                'chat-messages__buttons' + !this.props.chat.id ? ' d-none' : ''
              }
            >
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
            <span
              className={
                'chat-messages__no-chat-caption' +
                (this.props.chat.id ? ' d-none' : '')
              }
            >
              Select a chat to start messaging
            </span>
          </div>

          <div
            className={
              'chat-messages__input' + (!this.props.chat.id ? ' d-none' : '')
            }
            onClick={this.focusInput}
          >
            <div
              className={
                'chat-messages__input__attach' +
                (this.state.attachmentsButtonOpen
                  ? ' chat-messages__input__attach--active'
                  : '')
              }
            >
              {/* <span className="chat-messages__input__attach-inside chat-messages__input__attach-inside--3 chat-messages__input__round-button"> */}
              {/*   <IconMic active /> */}
              {/*   <input */}
              {/*     type="image" */}
              {/*     alt="Upload" */}
              {/*     className="hidden-input" */}
              {/*     onChange={this.onRecordingChange} */}
              {/*     ref={this.fileInputRefs[0]} */}
              {/*   /> */}
              {/* </span> */}
              <span className="chat-messages__input__attach-inside chat-messages__input__attach-inside--2 chat-messages__input__round-button">
                <img
                  src={iconAttachImage}
                  alt="Attachment"
                  style={{ width: '18px', height: '18px' }}
                />
                <input
                  type="file"
                  alt="Upload"
                  className="hidden-input"
                  onChange={this.onImageChange}
                  ref={this.fileInputRefs[1]}
                />
              </span>
              <span className="chat-messages__input__attach-inside chat-messages__input__attach-inside--1 chat-messages__input__round-button">
                <IconFileInChat color={'#fff'} />
                <input
                  type="file"
                  className="hidden-input"
                  onChange={this.onFileChange}
                  ref={this.fileInputRefs[2]}
                />
              </span>

              <span
                className="chat-messages__input__attach-open chat-messages__input__round-button"
                onClick={this.toggleAttachmentsButtonOpen}
              >
                <IconPlus />
              </span>
            </div>

            <div className="chat-messages__input__input">
              <input
                type="text"
                placeholder={' '}
                value={this.state.chatInput}
                onChange={this.handleChatInputChange}
                onKeyDown={this.handleKeyDown}
                hidden={!!this.state.file}
              />
              <span className="chat-messages__input__placeholder">
                {this.renderInputSwitch(this.state.messageType)}
              </span>
            </div>

            {this.state.messageType !== 'TEXT' ? (
              <span className="chat-messages__input__clear-file">
                <IconPlus
                  color="#000"
                  className="rotate45"
                  onClick={this.clearFile}
                />
              </span>
            ) : null}
            <span
              className="chat-messages__input__send chat-messages__input__round-button"
              onClick={this.sendMessage}
            >
              {this.state.loading ? (
                <div class="lds-ring">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <img alt="Send a message" src={iconSend} />
              )}
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
