import React, {Component} from 'react';

import IconFileInChat from "../icon_components/IconFileInChat";

import avatarImage from "../assets/img/avatar_image.jpg"
import iconPointsHorizontal from "../assets/img/icon_points_horizontal.svg"
import iconRead from "../assets/img/icon_read.svg"
import iconSent from "../assets/img/icon_sent.svg"

import recordingMessage from "../assets/audio.mp3"

import {onlineString} from "../utils";

class Message extends Component {

    render() {
        let messageStatus = null
        if(!this.props.isMessagePartners) {
            messageStatus = (!this.props.isMessagePartners
                ? <img src={iconRead} className={"message__status"} alt={""} />
                : <img src={iconSent} className={"message__status"} alt={""} />)
        }

        let message = null
        switch (this.props.messageType) {
            case "TEXT":
                message = this.props.content
                break
            case "RECORDING":
                message = (
                    <audio controls>
                        <source src={recordingMessage} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
                )
                break
            case "FILE":
                message = (
                    <a className="message__download" href={this.props.content.download} download>
                        <div className="message__download__wrapper">
                            <IconFileInChat color={this.props.isMessagePartners ? "#fff" : null} />
                        </div>
                        <div className="message__download__data">
                            <span className="message__download__data-name">Style.zip</span>
                            <span className="message__download__data-size">41.36 Mb</span>
                        </div>
                    </a>
                )
                break
            case "IMAGE":
                message = (
                    <div className="message__photo">
                        <img src={avatarImage} alt={""} />
                    </div>
                )
                break

            default:
                message = this.props.content
        }


        return (
            <div className={"message" +
                (this.props.isMessagePartners ? " message--partner" : " message--user")}
            >

            <div className="message__text-wrapper">
            {this.props.isMessagePartners ? null : (
                <img className={"message__points"} src={iconPointsHorizontal}  alt={""}/>
            )}

            <div className="message__text">{message}</div>

            {this.props.isMessagePartners ? (
                <img className={"message__points"} src={iconPointsHorizontal}  alt={""}/>
            ) : null}

            {messageStatus}

        </div>
        <span className={"message__time-ago"}>{onlineString(this.props.ago)} ago</span>

    </div>
        );
    }
}

export default Message;
