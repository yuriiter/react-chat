import React, {Component} from 'react';
import {connect} from "react-redux";
import {Snackbar, Alert} from '@mui/material'

import Navigation from "../components/Navigation";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";


class ChatView extends Component {
    state = {
        globalTimerInterval: null,
    }

    componentDidMount() {
        this.setState({globalTimerInterval: setInterval(() => this.props.dispatch({type: "UPDATE_GLOBAL_TIMER"}), 1000 * 30)});
    }

    componentWillUnmount() {
        clearInterval(this.state.globalTimerInterval);
    }
    

    toggleMobileNavOpen = () => this.props.dispatch({type: "TOGGLE_MOBILENAVOPEN"})

    // Example of a request to backend
    componentDidMount() {
        fetch(process.env.REACT_APP_BACKEND_API_URL + "/users/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${this.props.accessToken}`
            }
        })
            .then(response => response.json())
            .then(json => {
                const statusCode = json.statusCode;
                if(statusCode) {
                    if(statusCode === 401) {
                        this.props.dispatch({type: "SET_ACCESS_TOKEN", payload: null})
                        this.props.dispatch({type: "SET_USER", payload: null})
                        this.setState({message: "Unauthorized", messageType: "error"})
                        this.setState({changeLocationTimer: setTimeout(() => {
                            window.location.href = "/signin"
                        }, 2000)})
                    }
                }

                this.props.dispatch({type: "SET_USER", payload: json})
            });
    }

    componentWillUnmount() {
        clearTimeout(this.state.changeLocationTimer) 
        this.setState({changeLocationTimer: null})
    }

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
                    
                <Snackbar open={this.state.message !== undefined} autoHideDuration={6000} onClose={this.closeAlert}>
                    <Alert onClose={this.closeAlert} severity={this.state.messageType} sx={{ width: '100%' }}>
                        {this.state.message}
                    </Alert>
                </Snackbar>
                </>
        );
    }
}

const mapStateToProps = state => {
    return {
        mobileNavOpen: state.mobileNavOpen,
        isChatOpen: state.isChatOpen,
        user: state.user,
        accessToken: state.accessToken,
        
    }
}

export default connect(mapStateToProps)(ChatView);
