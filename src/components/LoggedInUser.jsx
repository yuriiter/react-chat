import { Component } from 'react';
import { connect } from 'react-redux';

import avatarImage from '../assets/img/avatar_image.jpg';

const colors = ['#70A9A1', '#FAB3A9', '#DAB6FC', '#C7D66D', '#9ee37d'];

class LoggedInUser extends Component {
  render() {
    if (this.props.user && this.props.user.fullName) {
      this.alias = this.props.user.fullName[0] + this.props.user.fullName[1];

      this.colorIdx =
        (this.props.user.fullName[0].charCodeAt(0) +
          this.props.user.fullName[1].charCodeAt(0)) %
        colors.length;
    }
    return (
      <div className={'avatar'}>
        <div
          alt=""
          className="avatar__image avatar__image--navigation"
          style={
            this.alias
              ? {
                  backgroundColor: colors[this.colorIdx],
                }
              : {}
          }
        >
          <span>{this.alias}</span>
        </div>
        <span className="">{this.props.user?.email}</span>
        <h4 className={'avatar__name'}>{this.props.user?.fullName}</h4>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(LoggedInUser);
