import { Component } from 'react'

import avatarImage from "../assets/img/avatar_image.jpg"

class LoggedInUser extends Component {
  render () {
    return (
      <div className={"avatar"}>
        <img src={avatarImage} alt="" className="avatar__image avatar__image--navigation" />
        <h4 className={"avatar__name"}>Henry Jabbawockiez</h4>
      </div>
    )
  }
}

export default LoggedInUser
