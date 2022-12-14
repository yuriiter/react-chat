import React, { Component } from 'react';
import { connect } from 'react-redux';

import UserStatus from './UserStatus';

import { onlineString, getRemoteUser } from '../utils';

import IconFile from '../icon_components/IconFile';
import IconImage from '../icon_components/IconImage';
import IconMic from '../icon_components/IconMic';

const colors = ['#70A9A1', '#FAB3A9', '#DAB6FC', '#C7D66D', '#9ee37d'];

class ChatListItem extends Component {
  state = {
    messageChunk: '',
    countOfNewMessagesValue: 0,
    remoteUser: {},
    chat: this.props.chat,
    status: this.props.chat.status,
  };

  renderMessage = () => {
    const lastMessageIdx = this.props.chat.messages.length - 1;
    let lastMessage, messageType;

    let messageChunk;
    if (lastMessageIdx === -1) {
      messageChunk = (
        <div className={'message-text'}>
          <p>(No messages yet)</p>
        </div>
      );
    } else {
      lastMessage = this.props.chat.messages[lastMessageIdx];
      messageType = lastMessage.messageType;
      switch (messageType) {
        case 'TEXT':
          messageChunk = (
            <div className={'message-text'}>
              <p>
                {(lastMessage.authorId === this.props.user.id ? 'You: ' : '') +
                  lastMessage.messageContent}
              </p>
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
          messageChunk = (
            <div className={'message-text'}>
              <p>
                {(lastMessage.authorId === this.props.user.id ? 'You: ' : '') +
                  (lastMessage.messageContent || '')}
              </p>
              <div className={'message-files'}>
                <div className="message-files">
                  <div className="message-files__item message-files__item--file">
                    <IconFile active={this.props.chat.active} />
                    <span>{lastMessage.fileName}</span>
                  </div>
                </div>
              </div>
            </div>
          );
          break;
        case 'IMAGE':
          messageChunk = (
            <div className={'message-text'}>
              <p>
                {(lastMessage.authorId === this.props.user.id ? 'You: ' : '') +
                  (lastMessage.messageContent || '')}
              </p>
              <div className={'message-files'}>
                <div className="message-files">
                  <div className="message-files__item message-files__item--file">
                    <IconImage active={this.props.chat.active} />
                    <span>{lastMessage.fileName}</span>
                  </div>
                </div>
              </div>
            </div>
          );
          break;
        default:
          break;
      }
    }

    const countOfNewMessagesValue = this.countOfNewMessages(this.props.chat);

    const remoteUser = getRemoteUser(this.props.user.id, this.props.chat.users);
    const status = this.props.chat.status;
    const lastMessageTime = lastMessage?.sentDateTime;

    this.setState({
      remoteUser: remoteUser,
      countOfNewMessagesValue: countOfNewMessagesValue,
      messageChunk: messageChunk,
      chat: this.props.chat,
      status: status,
      userDt: remoteUser.lastOnline,
      messageDt: lastMessageTime,
    });
  };

  countOfNewMessages = (chat) => {
    const userId = this.props.user.id;
    const arrayIndexOfCurrentUser = chat.users[0].id === userId ? 0 : 1;
    return chat.countOfNewMessagesToUsers[arrayIndexOfCurrentUser];
  };

  openChat = () => {
    this.props.dispatch({ type: 'OPEN_CHAT', payload: this.props.chat.id });
  };

  componentDidMount() {
    this.renderMessage();
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.chat !== this.props.chat ||
      prevProps.chat.messages !== this.props.chat.messages
    ) {
      this.renderMessage();
    }
  }

  render() {
    if (this.state.remoteUser && this.state.remoteUser.fullName) {
      this.alias =
        this.state.remoteUser.fullName[0] + this.state.remoteUser.fullName[1];

      this.colorIdx =
        (this.state.remoteUser.fullName[0].charCodeAt(0) +
          this.state.remoteUser.fullName[1].charCodeAt(0)) %
        colors.length;
    }
    return (
      <div
        className={
          'chat-list__list-item ' +
          (this.state.chat.active ? 'chat-list__list-item--active' : '')
        }
        onClick={this.openChat}
      >
        <div className="chat-list__list-item__top">
          <div className="chat-list__list-item__user">
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
              {this.state.status === 'ONLINE' ||
              this.state.status === 'RECODRING' ||
              this.state.status === 'WRITING' ? (
                <div className="online-status"></div>
              ) : null}
            </div>
            <div className="chat-list__list-item__user-text">
              <h3 className="chat-list__list-item__user-name">
                {this.state.remoteUser.fullName}
              </h3>
              <span className="chat-list__list-item__user-status">
                <UserStatus status={this.state.status} dt={this.state.userDt} />
              </span>
            </div>
          </div>

          <div className="chat-list__list-item__message-time">
            {onlineString(this.state.messageDt)}
          </div>
        </div>

        <div className="chat-list__list-item__message">
          {this.state.messageChunk}
          {this.state.countOfNewMessagesValue > 0 ? (
            <span className={'chat-list__list-item__message-count'}>
              <span>{this.state.countOfNewMessagesValue}</span>
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
