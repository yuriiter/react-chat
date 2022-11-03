import { Component } from 'react';

class IconPlus extends Component {
  render() {
    if (this.props.color) {
      console.log('ICON');
    }
    return (
      <svg
        width={this.props.width || 24}
        height={this.props.height || 24}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={this.props.className}
        onClick={this.props.onClick}
      >
        <g id="Icon/Outline/plus">
          <path
            id="Mask"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19 11H13V5C13 4.447 12.552 4 12 4C11.448 4 11 4.447 11 5V11H5C4.448 11 4 11.447 4 12C4 12.553 4.448 13 5 13H11V19C11 19.553 11.448 20 12 20C12.552 20 13 19.553 13 19V13H19C19.552 13 20 12.553 20 12C20 11.447 19.552 11 19 11Z"
            fill={this.props.color || '#231F20'}
          />
          <mask
            id="mask0_1_346"
            style={{ maskType: 'alpha' }}
            maskUnits="userSpaceOnUse"
            x="4"
            y="4"
            width="16"
            height="16"
          >
            <path
              id="Mask_2"
              fillRule="evenodd"
              clipRule="evenodd"
              d="M19 11H13V5C13 4.447 12.552 4 12 4C11.448 4 11 4.447 11 5V11H5C4.448 11 4 11.447 4 12C4 12.553 4.448 13 5 13H11V19C11 19.553 11.448 20 12 20C12.552 20 13 19.553 13 19V13H19C19.552 13 20 12.553 20 12C20 11.447 19.552 11 19 11Z"
              fill={this.props.color || '#fff'}
            />
          </mask>
          <g mask="url(#mask0_1_346)">
            <g id="&#240;&#159;&#142;&#168; Color">
              <rect
                id="Base"
                width="24"
                height="24"
                fill={this.props.color || '#fff'}
              />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default IconPlus;
