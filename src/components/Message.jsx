import { connect } from 'react-redux';
import React, { Component } from 'react';

import IconFileInChat from '../icon_components/IconFileInChat';

import iconPointsHorizontal from '../assets/img/icon_points_horizontal.svg';
import iconRead from '../assets/img/icon_read.svg';
import iconSent from '../assets/img/icon_sent.svg';

import { onlineString, displaySize } from '../utils';

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
    let fileActualName, fileSize, fileName, path;
    if (this.props.message.messageType !== 'TEXT') {
      fileActualName = this.props.message.fileActualName;
      fileSize = this.props.message.fileSize;
      fileName = this.props.message.fileName;
    }

    switch (this.props.message.messageType) {
      case 'TEXT':
        message = this.props.message.messageContent;
        break;
      /* case 'RECORDING': */
      /*   path = `${process.env.REACT_APP_BACKEND_API_URL}/chat_assets/recordings/${fileActualName}`; */
      /**/
      /*   message = ( */
      /*     <audio controls> */
      /*       <source src={recordingMessage} type="audio/mpeg" /> */
      /*       Your browser does not support the audio element. */
      /*     </audio> */
      /*   ); */
      /*   break; */
      case 'FILE':
        path = `${process.env.REACT_APP_BACKEND_API_URL}/chat_assets/files/${fileActualName}`;

        message = (
          <a className="message__download" href={path} download>
            <div className="message__download__wrapper">
              <IconFileInChat color={isMessagePartners ? '#fff' : null} />
            </div>
            <div className="message__download__data">
              <span className="message__download__data-name">{fileName}</span>
              <span className="message__download__data-size">
                {displaySize(parseInt(fileSize))}
              </span>
            </div>
          </a>
        );
        break;
      case 'IMAGE':
        path = `${process.env.REACT_APP_BACKEND_API_URL}/chat_assets/img/${fileActualName}`;

        message = (
          <div className="message__photo">
            <img crossOrigin="use-credentials" src={path} alt={fileName} />
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
