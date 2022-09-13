import React, {Component} from 'react';

import {onlineString} from "../utils";

class UserStatus extends Component {
    render() {
        if(this.props.status === "WRITING") {
            return (
                <div className={"user-status " + this.props.className} style={this.props.style}>
                    <div className="user-status__animation--writing user-status__animation">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <span>writing</span>
                </div>
            )
        }
        else if(this.props.status === "RECORDING") {
             return (
                <div className={"user-status " + this.props.className} style={this.props.style}>
                    <div className="user-status__animation--recording user-status__animation">
                        <div></div>
                        <div></div>
                    </div>
                    <span>recording a voice message</span>
                </div>
            )
        }
        else if(this.props.status === "LAST_ONLINE") {
            return (
                <div className={"user-status " + this.props.className} style={this.props.style}>
                    <span>last online {onlineString(this.props.ago)} ago</span>
                </div>
            )
        }
        else if(this.props.status === "ONLINE") {
            return (
                <div className={"user-status " + this.props.className} style={this.props.style}>
                    <span>online</span>
                </div>
            )
        }


    }
}

export default UserStatus;