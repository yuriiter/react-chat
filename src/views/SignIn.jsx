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

class SignIn extends Component {
  state = {
    emailInputValue: '',
    passwordInputValue: '',
  };

  changeEmailInputValue = (e) => {
    this.setState({ emailInputValue: e.target.value });
  };
  changePasswordInputValue = (e) => {
    this.setState({ passwordInputValue: e.target.value });
  };

  closeAlert = () =>
    this.props.dispatch({
      type: 'SET_SNACKBAR',
      payload: { snackBarMessage: undefined, snackBarMessageType: undefined },
    });

  signIn = () => {
    if (
      isEmailValid(this.state.emailInputValue) &&
      isPasswordValid(this.state.passwordInputValue)
    ) {
      axios
        .post(
          process.env.REACT_APP_BACKEND_API_URL + '/auth/signin',
          {
            email: this.state.emailInputValue,
            password: this.state.passwordInputValue,
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
                snackBarMessage: 'Bad credentials',
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
              snackBarMessage: 'You have succesfully signed in',
              snackBarMessageType: 'success',
            },
          });
          this.setState({ navigate: '/' });
        });
    }
  };

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_BACKEND_API_URL + '/users/me')
      .catch((error) => {
        console.log('Not authorized.');
      })
      .then((response) => {
        const json = response.data;
        this.props.dispatch({ type: 'SET_USER', payload: json });
        this.setState({ navigate: '/' });
      });
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
              Sign in to <span className="accent-color">Chat</span>
            </Typography>
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

            <Button
              className="signup__input signup__button"
              variant="contained"
              onClick={this.signIn}
            >
              Sign in
            </Button>

            <Link className="signup__link accent-color" to={'/signup'}>
              <span>I don't have an account</span>
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

export default connect(mapStateToProps)(SignIn);
