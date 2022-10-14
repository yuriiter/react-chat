import React, {Component} from 'react';
import {connect} from "react-redux";

import LoggedInUser from "./LoggedInUser";

import iconGrid from "../assets/img/icon_grid.svg"
import iconChat from "../assets/img/icon_chat.svg"
import iconPerson from "../assets/img/icon_person.svg"
import iconBell from "../assets/img/icon_bell.svg"
import iconCalendar from "../assets/img/icon_calendar.svg"
import iconSettings from "../assets/img/icon_settings.svg"
import iconPower from "../assets/img/icon_power.svg"


class Navigation extends Component {
    logOut = () => {
        this.props.dispatch({type: "SET_ACCESS_TOKEN", payload: null})
        window.location.href = "/signin"
    }

    render() {
        return (
            <div className={"navigation__wrapper" + (!this.props.mobileNavOpen ? " navigation__wrapper--closed-mobile" : "")}>

                <LoggedInUser />
                <nav className="navigation">
                    <ul className={"navigation__list"}>
                        <li className={"navigation__list-item--active"}>
                            <a href="#">
                                <img src={iconChat} />
                                <span>chat</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src={iconPerson} />
                                <span>contact</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src={iconBell} />
                                <span>notification</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src={iconCalendar} />
                                <span>calendar</span>
                            </a>
                        </li>
                        <li>
                            <a href="#">
                                <img src={iconSettings} />
                                <span>settings</span>
                            </a>
                        </li>
                    </ul>
                </nav>

                <button onClick={this.logOut} className={"navigation__logout"}>
                    <img src={iconPower} />
                    <span>log out</span>
                </button>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        mobileNavOpen: state.mobileNavOpen,
        user: state.user
    }
}


export default connect(mapStateToProps)(Navigation);
