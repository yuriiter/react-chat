import React, { Component } from 'react';
import { connect } from 'react-redux';

import { onlineString } from '../utils';

class UserStatus extends Component {
  state = {
    lastSeenString: this.props.dt ? onlineString(this.props.dt) : null,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.currentTime !== this.props.currentTime) {
      this.setState({
        lastSeenString: this.props.dt ? onlineString(this.props.dt) : null,
      });
    }
  }

  render() {
    if (this.props.status === 'WRITING') {
      return (
        <div
          className={'user-status ' + this.props.className}
          style={this.props.style}
        >
          <div className="user-status__animation--writing user-status__animation">
            <div></div>
            <div></div>
            <div></div>
          </div>
          <span>writing</span>
        </div>
      );
    } else if (this.props.status === 'RECORDING') {
      return (
        <div
          className={'user-status ' + this.props.className}
          style={this.props.style}
        >
          <div className="user-status__animation--recording user-status__animation">
            <div></div>
            <div></div>
          </div>
          <span>recording an audio</span>
        </div>
      );
    } else if (this.props.status === 'LAST_ONLINE') {
      return (
        <div
          className={'user-status ' + this.props.className}
          style={this.props.style}
        >
          <span>last seen {this.state.lastSeenString}</span>
        </div>
      );
    } else if (this.props.status === 'ONLINE') {
      return (
        <div
          className={'user-status ' + this.props.className}
          style={this.props.style}
        >
          <span>online</span>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    currentTime: state.currentTime,
  };
};

export default connect(mapStateToProps)(UserStatus);
