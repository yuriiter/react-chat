import React, {Component} from 'react';

import UserStatus from "./UserStatus";

import avatarImage from "../assets/img/avatar_image.jpg"

class ChatListItem extends Component {
    render() {
        return (
            <div className={"chat-list__list-item"}>
                <div className="chat-list__list-item__top">
                    <div className="chat-list__list-item__user">
                        <div className="chat-list__list-item__user-avatar">
                            <img src={avatarImage} alt=""/>
                            <div className="online-status"></div>
                        </div>
                        <div className="chat-list__list-item__user-text">
                            <h3 className="chat-list__list-item__user-name">Luy Robin</h3>
                            <span className="chat-list__list-item__user-status">
                                <UserStatus status={this.props.status} ago={this.props.ago} />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChatListItem;