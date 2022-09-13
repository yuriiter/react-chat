import React, {Component} from 'react';
import Navigation from "../components/Navigation";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";

class ChatView extends Component {
    render() {
        return (
            <div className={"box"}>
                <Navigation />
                <ChatList />
                <Chat />
            </div>
        );
    }
}

export default ChatView;