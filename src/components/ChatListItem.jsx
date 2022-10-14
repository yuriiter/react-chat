import React, {Component} from 'react';
import {connect} from "react-redux";

import UserStatus from "./UserStatus";

import {onlineString} from "../utils";

import avatarImage from "../assets/img/avatar_image.jpg"

import IconFile from "../icon_components/IconFile";
import IconImage from "../icon_components/IconImage";
import IconMic from "../icon_components/IconMic";

class ChatListItem extends Component {
    constructor(props) {
        super(props)
        switch(this.props.messageType) {
            case "TEXT":
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
                break
            case "RECORDING":
                this.messageChunk = (
                    <p className={"message-recording"}><IconMic active={this.props.active} /><span>Voice message (01:15)</span></p>
                )
                break
            case "FILE":
            case "IMAGE":
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
                break
            default:
                break
        }

        this.remoteUser = this.props.chat.users[0].id === this.props.user.id ?
            this.props.chat.users[1] : this.props.chat.users[0];

        this.countOfNewMessagesValue = this.countOfNewMessages(this.props.chat);
    }


    countOfNewMessages = chat => {
        const userId = this.props.user.id;
        const arrayIndexOfCurrentUser = (chat.users[0] === userId ? 0 : 1);
        return chat.countOfNewMessagesToUsers[arrayIndexOfCurrentUser];
    }

    /* componentDidMount() { */
    /*     fetch(process.env.REACT_APP_BACKEND_API_URL + `/chats/${this.props.chat.id}/messages?skip=0&take=10`, { */
    /*         method: "GET", */
    /*         headers: { */
    /*             "Authorization": `Bearer ${this.props.accessToken}` */
    /*         } */
    /*     }) */
    /*         .then(response => response.json()) */
    /*         .then(json => { */
    /*             console.log(json) */
    /*         }) */
    /* } */

    openChat = () => {
        this.props.dispatch({type: "OPEN_CHAT", payload: this.props.chat.id})
    }


    render() {
        return (
            <div className={"chat-list__list-item " +
                (this.props.active ? "chat-list__list-item--active" : "")}
                 onClick={this.openChat}
            >
                <div className="chat-list__list-item__top">
                    <div className="chat-list__list-item__user">
                        <div className="chat-list__list-item__user-avatar">
                            <img src={avatarImage} alt=""/>
                            {( this.props.chat.status === "ONLINE" ||
                                this.props.chat.status === "RECODRING" ||
                                this.props.chat.status === "WRITING"
                            ) ? (<div className="online-status"></div>) : null}
                        </div>
                        <div className="chat-list__list-item__user-text">
                            <h3 className="chat-list__list-item__user-name">{this.remoteUser.fullName}</h3>
                            <span className="chat-list__list-item__user-status">
                                <UserStatus status={this.props.status} ago={this.props.onlineAgo} />
                            </span>
                        </div>
                    </div>

                    <div className="chat-list__list-item__message-time">{onlineString(this.props.ago)} ago</div>
                </div>

                <div className="chat-list__list-item__message">
                    {this.messageChunk}
                    {this.countOfNewMessagesValue > 0 ? ( <span className={"chat-list__list-item__message-count"}><span>{this.countOfNewMessagesValue}</span></span> ) : null}</div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(ChatListItem);
