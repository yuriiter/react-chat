import React, {Component} from 'react';

import iconArrow from "../assets/img/icon_arrow.svg"
import iconPlus from "../assets/img/icon_plus.svg"
import iconSearch from "../assets/img/icon_search.svg"
import ChatListItem from "./ChatListItem";

class ChatList extends Component {
    searchRef = React.createRef(null)

    render() {
        return (
            <div className={"chat-list"}>
                <div className="chat-list__wrapper">
                    <div className="chat-list__top">
                        <div className="chat-list__top-filter">
                            <h2>Chats</h2>
                            <span>Recent chats <img src={iconArrow} alt=""/></span>
                        </div>

                        <button className="button primary-button chat-list__new-chat">
                            <img src={iconPlus} />
                            <span>Create new chat</span>
                        </button>
                    </div>

                    <div className="chat-list__search">
                        <div className="chat-list__search__shadow-container">
                            <div className="chat-list__search__shadow"></div>
                        </div>
                        <div className="chat-list__search__overlayer"></div>
                        <div className="chat-list__search__input" onClick={() => this.searchRef.current?.focus()}>
                            <img src={iconSearch} alt=""/>
                            <input type="text" placeholder={"Search"} ref={this.searchRef} />
                        </div>
                        <div className="chat-list__search__options button">
                            <span>Messages</span>
                            <img src={iconArrow} alt="" style={{marginLeft: "4px"}}/>
                        </div>
                    </div>
                </div>

                <div className="chat-list__list">
                    <ChatListItem status={"WRITING"} />
                    <ChatListItem status={"RECORDING"} />
                    <ChatListItem status={"LAST_ONLINE"} ago={10000} />
                    <ChatListItem status={"ONLINE"} />
                </div>
            </div>
        );
    }
}

export default ChatList;