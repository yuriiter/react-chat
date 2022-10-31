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
    chat: this.props.chat,
    status: this.props.chat.status,
  };

  renderMessage = () => {
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

    const countOfNewMessagesValue = this.countOfNewMessages(this.props.chat);

    const remoteUser = getRemoteUser(this.props.user.id, this.props.chat.users);
    const status = this.props.chat.status;
    const lastMessageTime = lastMessage.sentDateTime;

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
              <img src={avatarImage} alt="" />
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
