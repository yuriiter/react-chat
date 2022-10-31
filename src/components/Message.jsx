import { connect } from 'react-redux';
import React, { Component } from 'react';

import IconFileInChat from '../icon_components/IconFileInChat';

import avatarImage from '../assets/img/avatar_image.jpg';
import iconPointsHorizontal from '../assets/img/icon_points_horizontal.svg';
import iconRead from '../assets/img/icon_read.svg';
import iconSent from '../assets/img/icon_sent.svg';

import recordingMessage from '../assets/audio.mp3';

import { onlineString } from '../utils';

class Message extends Component {
  render() {
    const isMessagePartners =
      this.props.message.receiverId === this.props.user?.id;

    let messageStatusChunk = null;
    if (!isMessagePartners) {
      messageStatusChunk = this.props.message.isMessageRead ? (
        <img src={iconRead} className={'message__status'} alt={''} />
      ) : (
        <img src={iconSent} className={'message__status'} alt={''} />
      );
    }

    let message = null;
    switch (this.props.message.messageType) {
      case 'TEXT':
        message = this.props.message.messageContent;
        break;
      case 'RECORDING':
        message = (
          <audio controls>
            <source src={recordingMessage} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        );
        break;
      case 'FILE':
        message = (
          <a
            className="message__download"
            href={this.props.message.messageContent.download}
            download
          >
            <div className="message__download__wrapper">
              <IconFileInChat color={isMessagePartners ? '#fff' : null} />
            </div>
            <div className="message__download__data">
              <span className="message__download__data-name">Style.zip</span>
              <span className="message__download__data-size">41.36 Mb</span>
            </div>
          </a>
        );
        break;
      case 'IMAGE':
        message = (
          <div className="message__photo">
            <img src={avatarImage} alt={''} />
          </div>
        );
        break;

      default:
        message = this.props.message.messageContent;
    }

    return (
      <div
        className={
          'message' +
          (isMessagePartners ? ' message--partner' : ' message--user')
        }
      >
        <div className="message__text-wrapper">
          {isMessagePartners ? null : (
            <img
              className={'message__points'}
              src={iconPointsHorizontal}
              alt={''}
            />
          )}

          <div className="message__text">{message}</div>

          {isMessagePartners ? (
            <img
              className={'message__points'}
              src={iconPointsHorizontal}
              alt={''}
            />
          ) : null}

          {messageStatusChunk}
        </div>
        <span className={'message__time-ago'}>
          {onlineString(this.props.message.sentDateTime)}
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(Message);
