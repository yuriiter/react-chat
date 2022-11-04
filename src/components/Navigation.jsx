import { Navigate, Link } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import LoggedInUser from './LoggedInUser';

/* import iconGrid from '../assets/img/icon_grid.svg'; */
import iconChat from '../assets/img/icon_chat.svg';
import iconPerson from '../assets/img/icon_person.svg';
import iconBell from '../assets/img/icon_bell.svg';
import iconCalendar from '../assets/img/icon_calendar.svg';
import iconSettings from '../assets/img/icon_settings.svg';
import iconPower from '../assets/img/icon_power.svg';

axios.defaults.withCredentials = true;

class Navigation extends Component {
  state = {};
  logOut = () => {
    axios
      .get(process.env.REACT_APP_BACKEND_API_URL + '/auth/signout')
      .then(() => {
        this.props.dispatch({ type: 'SET_USER', payload: null });
        this.setState({ navigate: '/signin' });
      });
  };

  render() {
    if (this.state.navigate) {
      return <Navigate to={this.state.navigate} replace />;
    }
    return (
      <div
        className={
          'navigation__wrapper' +
          (!this.props.mobileNavOpen
            ? ' navigation__wrapper--closed-mobile'
            : '')
        }
      >
        <LoggedInUser />
        <nav className="navigation">
          <ul className={'navigation__list'}>
            <li className={'navigation__list-item--active'}>
              <Link to="/">
                <img src={iconChat} alt="Chat" />
                <span>chat</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                <img src={iconPerson} alt="Contact" />
                <span>contact</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                <img src={iconBell} alt="Notification" />
                <span>notification</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                <img src={iconCalendar} alt="Calendar" />
                <span>calendar</span>
              </Link>
            </li>
            <li>
              <Link to="/">
                <img src={iconSettings} alt="Settings" />
                <span>settings</span>
              </Link>
            </li>
          </ul>
        </nav>

        <button onClick={this.logOut} className={'navigation__logout'}>
          <img src={iconPower} alt="Log out" />
          <span>log out</span>
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    mobileNavOpen: state.mobileNavOpen,
    user: state.user,
  };
};

export default connect(mapStateToProps)(Navigation);
