import { Navigate } from 'react-router-dom';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import LoggedInUser from './LoggedInUser';

/* import iconGrid from '../assets/img/icon_grid.svg'; */
import iconChat from '../assets/img/icon_chat.svg';
import iconPerson from '../assets/img/icon_person.svg';
import iconBell from '../assets/img/icon_bell.svg';
import iconCalendar from '../assets/img/icon_calendar.svg';
import iconSettings from '../assets/img/icon_settings.svg';
import iconPower from '../assets/img/icon_power.svg';

class Navigation extends Component {
  state = {};
  logOut = () => {
    this.props.dispatch({ type: 'SET_ACCESS_TOKEN', payload: null });
    this.setState({ navigate: '/signin' });
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
              <a href="/">
                <img src={iconChat} alt="Chat" />
                <span>chat</span>
              </a>
            </li>
            <li>
              <a href="/">
                <img src={iconPerson} alt="Contact" />
                <span>contact</span>
              </a>
            </li>
            <li>
              <a href="/">
                <img src={iconBell} alt="Notification" />
                <span>notification</span>
              </a>
            </li>
            <li>
              <a href="/">
                <img src={iconCalendar} alt="Calendar" />
                <span>calendar</span>
              </a>
            </li>
            <li>
              <a href="/">
                <img src={iconSettings} alt="Settings" />
                <span>settings</span>
              </a>
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
