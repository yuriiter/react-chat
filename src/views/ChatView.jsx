import React, {Component} from 'react';
import {connect} from "react-redux";

import Navigation from "../components/Navigation";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";

class ChatView extends Component {
    toggleMobileNavOpen = () => this.props.dispatch({type: "TOGGLE_MOBILENAVOPEN"})

    render() {
        return (
            <>
                <div
                    className={"burger-mobile" +
                        (this.props.mobileNavOpen ? " burger-mobile--active" : "") +
                        (this.props.isChatOpen ? " burger-mobile--under-chat" : "")
                }
                    onClick={this.toggleMobileNavOpen}
                >
                    <div className="burger-mobile--items">
                        <div className="burger-mobile--item"></div>
                        <div className="burger-mobile--item"></div>
                        <div className="burger-mobile--item"></div>
                    </div>
                </div>
                <div className={"box"}>
                    <Navigation />
                    <ChatList />
                    <Chat status={"LAST_ONLINE"} onlineAgo={2000} />
                    <div className={"box__black-overlay" +
                        (this.props.mobileNavOpen ? " box__black-overlay--open" : "")}
                        onClick={this.toggleMobileNavOpen}
                    >
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        mobileNavOpen: state.mobileNavOpen,
        isChatOpen: state.isChatOpen
    }
}

export default connect(mapStateToProps)(ChatView);