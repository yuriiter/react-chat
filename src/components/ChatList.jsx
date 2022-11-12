import React, { Component } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
  Button,
} from '@mui/material';
import { connect } from 'react-redux';
import axios from 'axios';

import iconPlus from '../assets/img/icon_plus.svg';
import ChatListItem from './ChatListItem';
import { isEmailValid } from '../utils';

axios.defaults.withCredentials = true;

class ChatList extends Component {
  state = {
    openDialog: false,
    searchedUserEmail: '',
    chats: null,
  };

  searchRef = React.createRef(null);

  toggleDialog = () => this.setState({ openDialog: !this.state.openDialog });
  handleSearchUserEmailChange = (e) =>
    this.setState({ searchedUserEmail: e.target.value });
  closeAlert = () =>
    this.props.dispatch({
      type: 'SET_SNACKBAR',
      payload: { snackBarMessage: undefined, snackBarMessageType: undefined },
    });

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.chats !== this.props.chats) {
      this.setState({ chats: this.props.chats });
    }
  }

  createChat = (newUserId) => {
    axios
      .post(
        process.env.REACT_APP_BACKEND_API_URL + '/chats',
        { users: [this.props.user.id, newUserId] },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .catch((error) => {
        if (!error.response) {
          this.props.dispatch({
            type: 'SET_SNACKBAR',
            payload: {
              snackBarMessage: 'No connection to the server',
              snackBarMessageType: 'error',
            },
          });
          return;
        }
        const statusCode = error.response.status;
        if (statusCode) {
          if (statusCode === 400) {
            this.props.dispatch({
              type: 'SET_SNACKBAR',
              payload: {
                snackBarMessage: 'Something went wrong',
                snackBarMessageType: 'error',
              },
            });
          }
        }
      })
      .then((response) => {
        if (!response) {
          return;
        }
        const json = response.data;
        this.setState({ searchedUserEmail: '' });
        this.toggleDialog();
        this.props.dispatch({ type: 'ADD_CHAT', payload: json });
        this.props.dispatch({ type: 'OPEN_CHAT', payload: json.id });
      });
  };

  startChatting = () => {
    if (isEmailValid(this.state.searchedUserEmail)) {
      axios
        .get(
          process.env.REACT_APP_BACKEND_API_URL +
            '/users?email=' +
            this.state.searchedUserEmail,
        )
        .catch((error) => {
          if (!error.response) {
            this.props.dispatch({
              type: 'SET_SNACKBAR',
              payload: {
                snackBarMessage: 'No connection to the server',
                snackBarMessageType: 'error',
              },
            });
            return;
          }
          const statusCode = error.response.status;
          if (statusCode) {
            if (statusCode === 400) {
              this.props.dispatch({
                type: 'SET_SNACKBAR',
                payload: {
                  snackBarMessage: "User doesn't exist or unavaliable",
                  snackBarMessageType: 'error',
                },
              });
              this.setState({
                message: "User doesn't exist or unavaliable",
                messageType: 'error',
              });
            }
          }
        })
        .then((response) => {
          if (!response) {
            return;
          }
          const json = response.data;
          this.createChat(json.id);
        });
    }
  };

  render() {
    return (
      <div
        className={
          'chat-list' + (this.props.isChatOpen ? ' chat-list--closed' : '')
        }
      >
        <div className="chat-list__wrapper">
          <div className="chat-list__top">
            <div className="chat-list__top-filter">
              <h2>Chats</h2>
              {/* <span> */}
              {/*   Recent chats <img src={iconArrow} alt="" /> */}
              {/* </span> */}
            </div>

            <button
              className="button primary-button chat-list__new-chat"
              onClick={this.toggleDialog}
            >
              <img alt="New chat" src={iconPlus} />
              <span>new chat</span>
            </button>
          </div>

          {/* <div className="chat-list__search"> */}
          {/*   <div className="chat-list__search__shadow-container"> */}
          {/*     <div className="chat-list__search__shadow"></div> */}
          {/*   </div> */}
          {/*   <div className="chat-list__search__overlayer"></div> */}
          {/*   <div */}
          {/*     className="chat-list__search__input" */}
          {/*     onClick={() => this.searchRef.current?.focus()} */}
          {/*   > */}
          {/*     <img src={iconSearch} alt="" /> */}
          {/*     <input type="text" placeholder={'Search'} ref={this.searchRef} /> */}
          {/*   </div> */}
          {/*   <div className="chat-list__search__options button"> */}
          {/*     <span>Messages</span> */}
          {/*     <img src={iconArrow} alt="" style={{ marginLeft: '4px' }} /> */}
          {/*   </div> */}
          {/* </div> */}
        </div>

        <div className="chat-list__list">
          {this.state.chats?.length === 0 ? (
            <span>You don't have any chats yet</span>
          ) : (
            this.state.chats?.map((chat) => {
              return <ChatListItem key={chat.id} chat={chat} />;
            })
          )}
          {/* <ChatListItem status={"WRITING"} ago={100} messageType={"TEXT"} active={true} /> */}
          {/* <ChatListItem status={"RECORDING"} ago={100} messageType={"RECORDING"} /> */}
          {/* <ChatListItem status={"LAST_ONLINE"} onlineAgo={10000} ago={100} messageType={"TEXT"} /> */}
          {/* <ChatListItem status={"ONLINE"} ago={100} messageType={"FILE"} /> */}
        </div>

        <Dialog open={this.state.openDialog} onClose={this.toggleDialog}>
          <DialogTitle>User's email</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To start chatting, input the user's email and press button
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={this.state.searchedUserEmail}
              onChange={this.handleSearchUserEmailChange}
              error={!isEmailValid(this.state.searchedUserEmail)}
              helperText="The value must be an email"
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.toggleDialog}>Cancel</Button>
            <Button onClick={this.startChatting}>Start chatting</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isChatOpen: state.isChatOpen,
    accessToken: state.accessToken,
    user: state.user,
    chats: state.chats,
    currentTime: state.currentTime,
    snackBarMessage: state.snackBarMessage,
    snackBarMessageType: state.snackBarMessageType,
  };
};

export default connect(mapStateToProps)(ChatList);
