import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserStatus from './UserStatus';

import { onlineString, getRemoteUser } from '../utils';

import avatarImage from '../assets/img/avatar_image.jpg';

import IconFile from '../icon_components/IconFile';
import IconImage from '../icon_components/IconImage';
import IconMic from '../icon_components/IconMic';

class ChatListItem extends Component {
  state = {
    messageChunk: '',
    countOfNewMessagesValue: 0,
    remoteUser: {},
  };
  constructor(props) {
    super(props);
  }

  renderMessage = () => {
    /* console.log("NEW MESSAGE CHUNK") */
    const lastMessageIdx = this.props.chat.messages.length - 1;

    let messageChunk;
    if (lastMessageIdx === -1) {
      messageChunk = (
        <div className={'message-text'}>
          <p>(No messages yet)</p>
        </div>
      );
      return;
    }
    const lastMessage = this.props.chat.messages[lastMessageIdx];
    const messageType = lastMessage.messageType;

    switch (messageType) {
      case 'TEXT':
        messageChunk = (
          <div className={'message-text'}>
            <p>
              {(lastMessage.authorId === this.props.user.id ? 'You: ' : '') +
                lastMessage.messageContent}
            </p>
            <div className="message-files">
              <div className="message-files__item message-files__item--file">
                <IconFile active={this.props.chat.active} />
                <span>Files (x2)</span>
              </div>
              <div className="message-files__item message-files__item--image">
                <IconImage active={this.props.chat.active} />
                <span>Photo</span>
              </div>
            </div>
          </div>
        );
        break;
      case 'RECORDING':
        messageChunk = (
          <p className={'message-recording'}>
            <IconMic active={this.props.chat.active} />
            <span>Voice message (01:15)</span>
          </p>
        );
        break;
      case 'FILE':
      case 'IMAGE':
        messageChunk = (
          <div className={'message-files'}>
            <div className="message-files">
              <div className="message-files__item message-files__item--file">
                <IconFile active={this.props.chat.active} />
                <span>Files (x2)</span>
              </div>
              <div className="message-files__item message-files__item--image">
                <IconImage active={this.props.chat.active} />
                <span>Photo</span>
              </div>
            </div>
          </div>
        );
        break;
      default:
        break;
    }

    const remoteUser = getRemoteUser(
      this.props.user?.id,
      this.props.chat?.users,
    );
    const countOfNewMessagesValue = this.countOfNewMessages(this.props.chat);

    this.setState({
      remoteUser: remoteUser,
      countOfNewMessagesValue: countOfNewMessagesValue,
      messageChunk: messageChunk,
    });
  };

  countOfNewMessages = (chat) => {
    const userId = this.props.user.id;
    const arrayIndexOfCurrentUser = chat.users[0] === userId ? 1 : 0;
    return chat.countOfNewMessagesToUsers[arrayIndexOfCurrentUser];
  };

  openChat = () => {
    this.props.dispatch({ type: 'OPEN_CHAT', payload: this.props.chat.id });
  };

  componentDidMount(prevProps, prevState) {
    this.renderMessage();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chat !== this.props.chat) {
      this.renderMessage();
    }
  }

  render() {
    const chat = this.props.chat;
    const remoteUser = getRemoteUser(this.props.user.id, chat.users);
    const status = chat.status;
    const lastMessageTime =
      chat.messages.length === 0
        ? undefined
        : Date.parse(chat.messages[0].sentDateTime);
    const userLastOnline = remoteUser.lastOnline;
    const ago = (this.props.currentTime - lastMessageTime) / 1000;

    let userLastOnlineAgo;
    if (status === 'LAST_ONLINE') {
      userLastOnlineAgo =
        (this.props.currentTime - Date.parse(userLastOnline)) / 1000;
    }

    return (
      <div
        className={
          'chat-list__list-item ' +
          (chat.active ? 'chat-list__list-item--active' : '')
        }
        onClick={this.openChat}
      >
        <div className="chat-list__list-item__top">
          <div className="chat-list__list-item__user">
            <div className="chat-list__list-item__user-avatar">
              <img src={avatarImage} alt="" />
              {this.props.chat.status === 'ONLINE' ||
              this.props.chat.status === 'RECODRING' ||
              this.props.chat.status === 'WRITING' ? (
                <div className="online-status"></div>
              ) : null}
            </div>
            <div className="chat-list__list-item__user-text">
              <h3 className="chat-list__list-item__user-name">
                {remoteUser.fullName}
              </h3>
              <span className="chat-list__list-item__user-status">
                <UserStatus status={status} ago={userLastOnlineAgo} />
              </span>
            </div>
          </div>

          <div className="chat-list__list-item__message-time">
            {onlineString(ago)} ago
          </div>
        </div>

        <div className="chat-list__list-item__message">
          {this.state.messageChunk}
          {this.countOfNewMessagesValue > 0 ? (
            <span className={'chat-list__list-item__message-count'}>
              <span>{this.countOfNewMessagesValue}</span>
            </span>
          ) : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    currentTime: state.currentTime,
  };
};

export default connect(mapStateToProps)(ChatListItem);
