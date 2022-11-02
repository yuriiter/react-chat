import { Navigate } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';

import Navigation from '../components/Navigation';
import ChatList from '../components/ChatList';
import Chat from '../components/Chat';

class ChatView extends Component {
  state = {};

  toggleMobileNavOpen = () =>
    this.props.dispatch({ type: 'TOGGLE_MOBILENAVOPEN' });

  closeAlert = () =>
    this.props.dispatch({
      type: 'SET_SNACKBAR',
      payload: { snackBarMessage: undefined, snackBarMessageType: undefined },
    });

  componentDidMount() {
    this.interval = setInterval(() => {
      this.props.dispatch({ type: 'UPDATE_GLOBAL_TIMER' });
    }, 1000 * 1);

    fetch(process.env.REACT_APP_BACKEND_API_URL + '/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        const statusCode = json.statusCode;
        if (statusCode) {
          if (statusCode === 401) {
            this.props.dispatch({ type: 'SET_ACCESS_TOKEN', payload: null });
            this.props.dispatch({ type: 'SET_USER', payload: null });
            this.props.dispatch({
              type: 'SET_SNACKBAR',
              payload: {
                snackBarMessage: 'Unauthorized',
                snackBarMessageType: 'error',
              },
            });
            this.setState({ navigate: '/signin' });
          }
        }

        this.props.dispatch({ type: 'SET_USER', payload: json });
      })
      .then(() => {
        fetch(process.env.REACT_APP_BACKEND_API_URL + '/chats', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.props.accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((json) => {
            const statusCode = json.statusCode;
            if (statusCode) {
              if (statusCode === 401) {
                this.props.dispatch({
                  type: 'SET_SNACKBAR',
                  payload: {
                    snackBarMessage: 'Unauthorized',
                    snackBarMessageType: 'error',
                  },
                });
                this.setState({ navigate: '/signin' });
              }
            } else {
              this.props.dispatch({ type: 'SET_CHATS', payload: json });
            }
          });
      });
  }

  render() {
    if (this.state.navigate) {
      return <Navigate to={this.state.navigate} replace />;
    }
    return (
      <>
        <div
          className={
            'burger-mobile' +
            (this.props.mobileNavOpen ? ' burger-mobile--active' : '') +
            (this.props.isChatOpen ? ' burger-mobile--under-chat' : '')
          }
          onClick={this.toggleMobileNavOpen}
        >
          <div className="burger-mobile--items">
            <div className="burger-mobile--item"></div>
            <div className="burger-mobile--item"></div>
            <div className="burger-mobile--item"></div>
          </div>
        </div>
        <div className={'box'}>
          <Navigation />
          <ChatList />
          <Chat />
          <div
            className={
              'box__black-overlay' +
              (this.props.mobileNavOpen ? ' box__black-overlay--open' : '')
            }
            onClick={this.toggleMobileNavOpen}
          ></div>
        </div>

        <Snackbar
          open={
            this.props.snackBarMessage !== undefined &&
            this.props.snackBarMessage !== null
          }
          autoHideDuration={6000}
          onClose={this.closeAlert}
        >
          <Alert
            onClose={this.closeAlert}
            severity={this.props.snackBarMessageType}
            sx={{ width: '100%' }}
          >
            {this.props.snackBarMessage}
          </Alert>
        </Snackbar>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mobileNavOpen: state.mobileNavOpen,
    isChatOpen: state.isChatOpen,
    user: state.user,
    accessToken: state.accessToken,
    snackBarMessage: state.snackBarMessage,
    snackBarMessageType: state.snackBarMessageType,
  };
};

export default connect(mapStateToProps)(ChatView);
