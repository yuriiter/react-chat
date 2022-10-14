import React, {Component} from 'react';
import {connect} from "react-redux";
import { io } from "socket.io-client"

import { getRemoteUser } from "../utils";

import UserStatus from "./UserStatus";
import Message from "./Message";

import IconFileInChat from "../icon_components/IconFileInChat";

import avatarImage from "../assets/img/avatar_image.jpg"
import iconAttachment from "../assets/img/icon_attachment.svg"
import iconPoints from "../assets/img/icon_points.svg"
import iconPlus from "../assets/img/icon_plus.svg"
import iconAttachImage from "../assets/img/icon_attach_image.svg"
import iconSend from "../assets/img/icon_send.svg"
import iconArrowLeft from "../assets/img/icon_arrow_left.svg"

class Chat extends Component {
    state = {
        attachmentsButtonOpen: false,
        chatInput: ""
    }
    
    socketOptions = {
        transportOptions: {
            polling: {
                extraHeaders: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                }
            }
        }
    };
    socket = io(process.env.REACT_APP_BACKEND_API_URL, this.socketOptions);


    handleKeyDown = e => {
        if(e.key === "Enter") {
            this.sendTextMessage();
        }
    }
    
    componentDidMount() {
        this.socket.on('connect', () => {
            console.log('Connected!');
        });
        this.socket.on('onMessage', (newMessage) => {
            console.log('onMessage event received!');
            console.log(newMessage);
        });
    }

    componentWillUnmount() {
        this.socket.off("connect");
        this.socket.off("onMessage");
    }
    
    handleChatInputChange = e => this.setState({chatInput: e.target.value})

    toggleAttachmentsButtonOpen = () =>
        this.setState({attachmentsButtonOpen: !this.state.attachmentsButtonOpen})

    closeChat = () => this.props.dispatch({type: "CLOSE_CHAT"})


    sendTextMessage = () => {
        if(this.state.chatInput.trim().length === 0) {
            this.setState({chatInput: ""});
            return;
        }

        this.socket.emit("newMessage", {
            receiverId: this.remoteUser.id,
            chatId: this.props.chat.id,
            messageType: "TEXT",
            messageContent: this.chatInput
        });
        this.setState({chatInput: ""});

        /* fetch(process.env.REACT_APP_BACKEND_API_URL + "/messages", { */
        /*     method: "POST", */
        /*     headers: { */
        /*         "Authorization": `Bearer ${this.props.accessToken}` */
        /*     }, */
        /*     body: JSON.stringify({ */
        /*         receiverId: this.remoteUser.id, */
        /*         chatId: this.props.chat.id, */
        /*         messageType: "TEXT", */
        /*         messageContent: this.state.chatInput */
        /*     }) */
        /* }) */
        /*     .then(response => response.json()) */
    }


    render() {
        const content = "https://google.com"
        const file = {
            download: "https://google.com"
        }

        this.remoteUser = getRemoteUser(this.props.user?.id, this.props.chat?.users);

        
        return (
            <div className={"chat-messages"}>
                <div className="chat-messages__shadow"></div>
                <div className="chat-messages__container">
                    <div className="chat-messages__top">
                        <div className="chat-list__list-item__user">
                            <img src={iconArrowLeft} className={"chat-messages__back-button"} onClick={this.closeChat} />
                            <div className="chat-list__list-item__user-avatar">
                                <img src={avatarImage} alt=""/>
                                {getRemoteUser(this.props.user?.id, this.props.chat?.users?.fullName)?.status === "ONLINE" ? (<div className="online-status"></div>) : null}
                            </div>
                            <div className="chat-list__list-item__user-text">
                                <h3 className="chat-list__list-item__user-name">{this.remoteUser?.fullName}</h3>
                                <span className="chat-list__list-item__user-status">
                                <UserStatus status={this.props.status} ago={( this.props.currentTime - Date.parse(this.remoteUser?.lastOnline) ) / 1000} />
                            </span>
                            </div>
                        </div>

                        <div className="chat-messages__buttons">
                            <div className="chat-messages__button chat-messages__buttons__attachment"><img src={iconAttachment}  alt={""}/></div>
                            <div className="chat-messages__button chat-messages__buttons__options"><img src={iconPoints} alt={""} /></div>
                        </div>
                    </div>

                    <div className="chat-messages__messages">
                        {this.props.chat?.messages?.map((message) => {
                            const isMessagePartners = message.receiverId === this.props.user?.id;
                            const ago = ( this.props.currentTime - message.sentDateTime ) / 1000;
                            return (
                                <Message
                                    isMessagePartners={isMessagePartners}
                                    ago={ago}
                                    messageType={message.messageType}
                                    content={message.messageContent}
                                />
                            )
                        })}
                        {/* <Message isMessagePartners={false} ago={1000} messageType={"FILE"} content={file}/> */}
                        {/* <Message isMessagePartners={false} ago={1000} messageType={"RECORDING"} content={content}/> */}
                        {/* <Message isMessagePartners={false} ago={1000} messageType={"IMAGE"} content={content}/> */}
                    </div>

                    <div className="chat-messages__input" onClick={this.focusInput}>
                        <div
                            className={"chat-messages__input__attach" +
                                (this.state.attachmentsButtonOpen ? " chat-messages__input__attach--active" : "")}
                        >
                            <span className="chat-messages__input__attach-inside chat-messages__input__attach-inside--2 chat-messages__input__round-button">
                                <img src={iconAttachImage} alt="" style={{width: "18px", height: "18px"}} />
                            </span>
                            <span className="chat-messages__input__attach-inside chat-messages__input__attach-inside--1 chat-messages__input__round-button">
                                <IconFileInChat color={"#fff"} />
                            </span>

                            <span
                                className="chat-messages__input__attach-open chat-messages__input__round-button"
                                onClick={this.toggleAttachmentsButtonOpen}
                            >
                                <img src={iconPlus} alt=""/>
                            </span>
                        </div>

                        <div className="chat-messages__input__input">
                            <input
                                type="text"
                                placeholder={" "}
                                value={this.state.chatInput}
                                onChange={this.handleChatInputChange}
                                onKeyDown={this.handleKeyDown}
                            />
                            <span className="chat-messages__input__placeholder">Type a message</span>
                        </div>

                        <span
                            className="chat-messages__input__send chat-messages__input__round-button"
                            onClick={this.sendTextMessage}
                        >
                            <img src={iconSend} />
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        chat: state.chat,
        user: state.user,
        currentTime: state.currentTime,
        accessToken: state.accessToken
    }
}
export default connect(mapStateToProps)(Chat);
