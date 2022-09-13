import React, {Component} from 'react';

import UserStatus from "./UserStatus";

import {onlineString} from "../utils";

import avatarImage from "../assets/img/avatar_image.jpg"

import IconFile from "../icon_components/IconFile";
import IconImage from "../icon_components/IconImage";
import IconMic from "../icon_components/IconMic";

class ChatListItem extends Component {

    render() {
        if(this.props.messageType === "TEXT") {
            this.messageChunk = (
                <div className={"message-text"}>
                    <p>
                        Most of its text is made up from sections 1.10.32–3 of
                        Cicero's De finibus bonorum et malorum (On the Boundaries
                        of Goods and Evils; finibus may also be translated as purposes).
                    </p>
                    <div className="message-files">
                        <div className="message-files__item message-files__item--file">
                            <IconFile active={this.props.active} />
                            <span>Files (x2)</span>
                        </div>
                        <div className="message-files__item message-files__item--image">
                            <IconImage active={this.props.active} />
                            <span>Photo</span>
                        </div>
                    </div>
                </div>
            )
        }
        else if(this.props.messageType === "RECORDING") {
            this.messageChunk = (
                <p className={"message-recording"}><IconMic active={this.props.active} /><span>Voice message (01:15)</span></p>
            )
        }
        else if(this.props.messageType === "FILE") {
            this.messageChunk = (
               <div className={"message-files"}>
                   <div className="message-files">
                       <div className="message-files__item message-files__item--file">
                           <IconFile active={this.props.active} />
                           <span>Files (x2)</span>
                       </div>
                       <div className="message-files__item message-files__item--image">
                           <IconImage active={this.props.active} />
                           <span>Photo</span>
                       </div>
                   </div>
               </div>
            )
        }



        return (
            <div className={"chat-list__list-item " +
                (this.props.active ? "chat-list__list-item--active" : "")}
            >
                <div className="chat-list__list-item__top">
                    <div className="chat-list__list-item__user">
                        <div className="chat-list__list-item__user-avatar">
                            <img src={avatarImage} alt=""/>
                            <div className="online-status"></div>
                        </div>
                        <div className="chat-list__list-item__user-text">
                            <h3 className="chat-list__list-item__user-name">Luy Robin</h3>
                            <span className="chat-list__list-item__user-status">
                                <UserStatus status={this.props.status} ago={this.props.onlineAgo} />
                            </span>
                        </div>
                    </div>

                    <div className="chat-list__list-item__message-time">{onlineString(this.props.ago)} ago</div>
                </div>

                <div className="chat-list__list-item__message">
                    {this.messageChunk}
                    <span className={"chat-list__list-item__message-count"}><span>1</span></span>
                </div>
            </div>
        );
    }
}

export default ChatListItem;