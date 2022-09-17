import React, {Component} from 'react';
import {connect} from "react-redux";

import UserStatus from "./UserStatus";
import Message from "./Message";

import avatarImage from "../assets/img/avatar_image.jpg"
import iconAttachment from "../assets/img/icon_attachment.svg"
import iconPoints from "../assets/img/icon_points.svg"
import iconPlus from "../assets/img/icon_plus.svg"
import iconAttachImage from "../assets/img/icon_attach_image.svg"
import iconSmiley from "../assets/img/icon_smiley.svg"
import iconSend from "../assets/img/icon_send.svg"
import iconArrowLeft from "../assets/img/icon_arrow_left.svg"

import IconFileInChat from "../icon_components/IconFileInChat";

class Chat extends Component {
    state = {
        attachmentsButtonOpen: false
    }

    toggleAttachmentsButtonOpen = () =>
        this.setState({attachmentsButtonOpen: !this.state.attachmentsButtonOpen})

    closeChat = () => this.props.dispatch({type: "CLOSE_CHAT"})


    render() {
        const content = "https://google.com"
        const file = {
            download: "https://google.com"
        }

        return (
            <div className={"chat-messages"}>
                <div className="chat-messages__shadow"></div>
                <div className="chat-messages__container">
                    <div className="chat-messages__top">
                        <div className="chat-list__list-item__user">
                            <img src={iconArrowLeft} className={"chat-messages__back-button"} onClick={this.closeChat} />
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

                        <div className="chat-messages__buttons">
                            <div className="chat-messages__button chat-messages__buttons__attachment"><img src={iconAttachment}  alt={""}/></div>
                            <div className="chat-messages__button chat-messages__buttons__options"><img src={iconPoints} alt={""} /></div>
                        </div>
                    </div>

                    <div className="chat-messages__messages">
                        <Message isMessagePartners={true} ago={1000} messageType={"TEXT"} content={"Hello!"}/>
                        <Message isMessagePartners={true} ago={1000} messageType={"FILE"} content={file}/>
                        <Message isMessagePartners={true} ago={1000} messageType={"RECORDING"} content={content}/>
                        <Message isMessagePartners={true} ago={1000} messageType={"IMAGE"} content={content}/>
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
                            <input type="text" placeholder={" "} />
                            <span className="chat-messages__input__placeholder">Type a message</span>
                        </div>

                        <span className="chat-messages__input__smileys" >
                            <img src={iconSmiley} />
                        </span>
                        <span className="chat-messages__input__send chat-messages__input__round-button" >
                            <img src={iconSend} />
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Chat);