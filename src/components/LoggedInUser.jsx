import { Component } from 'react'
import {connect} from "react-redux"

import avatarImage from "../assets/img/avatar_image.jpg"

class LoggedInUser extends Component {
  render () {
    return (
      <div className={"avatar"}>
        <img src={avatarImage} alt="" className="avatar__image avatar__image--navigation" />
        <span className="avatar__email">{this.props.user?.email}</span>
        <h4 className={"avatar__name"}>{this.props.user?.fullName}</h4>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(LoggedInUser)
