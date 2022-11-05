import { Component } from 'react';
import {
  TextField,
  Button,
  Card,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import { isEmailValid, isPasswordValid } from '../utils';

axios.defaults.withCredentials = true;

class SignUp extends Component {
  state = {
    emailInputValue: '',
    passwordInputValue: '',
    fullName: '',
    repeatPasswordInputValue: '',
  };

  changeFullNameInputValue = (e) => {
    this.setState({ fullName: e.target.value });
  };
  changeEmailInputValue = (e) => {
    this.setState({ emailInputValue: e.target.value });
  };
  changePasswordInputValue = (e) => {
    this.setState({ passwordInputValue: e.target.value });
  };
  changeRepeatPasswordInputValue = (e) => {
    this.setState({ repeatPasswordInputValue: e.target.value });
  };

  closeAlert = () =>
    this.props.dispatch({
      type: 'SET_SNACKBAR',
      payload: { snackBarMessage: undefined, snackBarMessageType: undefined },
    });

  signUp = () => {
    if (
      isEmailValid(this.state.emailInputValue) &&
      isPasswordValid(this.state.passwordInputValue) &&
      this.state.passwordInputValue === this.state.repeatPasswordInputValue
    ) {
      axios
        .post(
          process.env.REACT_APP_BACKEND_API_URL + '/auth/signup',
          {
            email: this.state.emailInputValue,
            password: this.state.passwordInputValue,
            fullName: this.state.fullName,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
        .catch((error) => {
          const statusCode = error.response.status;
          if (statusCode === 403) {
            this.props.dispatch({
              type: 'SET_SNACKBAR',
              payload: {
                snackBarMessage: 'A user with the same email exists',
                snackBarMessageType: 'error',
              },
            });
          } else if (statusCode === 400) {
            this.props.dispatch({
              type: 'SET_SNACKBAR',
              payload: {
                snackBarMessage: 'Bad parameters',
                snackBarMessageType: 'error',
              },
            });
          }
        })
        .then(() => {
          this.props.dispatch({
            type: 'SET_SNACKBAR',
            payload: {
              snackBarMessage: 'You have succesfully signed up',
              snackBarMessageType: 'success',
            },
          });
          this.setState({ navigate: '/signin' });
        });
    }
  };

  componentDidMount() {
    if (this.props.accessToken) {
      this.setState({ navigate: '/chat' });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.state.changeLocationTimer);
  }

  render() {
    if (this.state.navigate) {
      return <Navigate to={this.state.navigate} replace />;
    }
    return (
      <div className="signup">
        <div className="signup__box">
          <Card className="signup__card">
            <Typography variant="h6" component="h6">
              Create an account for <span className="accent-color">Chat</span>
            </Typography>
            <TextField
              className="signup__input"
              error={this.state.fullName.length === 0}
              label="Full name"
              variant="outlined"
              required
              value={this.state.fullName}
              onChange={this.changeFullNameInputValue}
            />
            <TextField
              className="signup__input"
              error={!isEmailValid(this.state.emailInputValue)}
              label="Email"
              variant="outlined"
              helperText="The value must be an email"
              required
              value={this.state.emailInputValue}
              onChange={this.changeEmailInputValue}
            />
            <TextField
              className="signup__input"
              error={!isPasswordValid(this.state.passwordInputValue)}
              label="Password"
              variant="outlined"
              type="password"
              helperText="Number of symbols must be between 6 and 20 with at least 1 capital letter and 1 number"
              required
              value={this.state.passwordInputValue}
              onChange={this.changePasswordInputValue}
            />

            <TextField
              className="signup__input"
              error={
                this.state.passwordInputValue !==
                this.state.repeatPasswordInputValue
              }
              label="Repeat password"
              variant="outlined"
              type="password"
              helperText="Passwords must be the same"
              required
              value={this.state.repeatPasswordInputValue}
              onChange={this.changeRepeatPasswordInputValue}
            />

            <Button
              className="signup__input signup__button"
              variant="contained"
              onClick={this.signUp}
            >
              Sign up
            </Button>

            <Link className="signup__link accent-color" to={'/signin'}>
              <span>I already have an account</span>
            </Link>
          </Card>
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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    accessToken: state.accessToken,
    snackBarMessage: state.snackBarMessage,
    snackBarMessageType: state.snackBarMessageType,
  };
};

export default connect(mapStateToProps)(SignUp);
