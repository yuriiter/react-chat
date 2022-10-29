import React, {Component} from 'react';

class IconFileInChat extends Component {
    render() {
        return (
            <svg className={"img"} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="Icon/Outline/file">
                    <path id="Mask" fillRule="evenodd" clipRule="evenodd" d="M17.4443 20H6.55531C6.24931 20 6.00031 19.776 6.00031 19.5V4.5C6.00031 4.224 6.24931 4 6.55531 4H11.0003V8.15C11.0003 9.722 12.2173 11 13.7143 11H18.0003V19.5C18.0003 19.776 17.7503 20 17.4443 20ZM17.6493 9H13.7143C13.3203 9 13.0003 8.619 13.0003 8.15V4H13.1123L17.6493 9ZM19.7403 8.328L14.2963 2.328C14.1073 2.119 13.8383 2 13.5553 2H6.55531C5.14631 2 4.00031 3.122 4.00031 4.5V19.5C4.00031 20.878 5.14631 22 6.55531 22H17.4443C18.8533 22 20.0003 20.878 20.0003 19.5V9C20.0003 8.751 19.9073 8.512 19.7403 8.328Z" fill="#231F20"/>
                    <mask id="mask0_1_512" style={{maskType: "alpha"}} maskUnits="userSpaceOnUse" x="4" y="2" width="17" height="20">
                        <path id="Mask_2" fillRule="evenodd" clipRule="evenodd" d="M17.4443 20H6.55531C6.24931 20 6.00031 19.776 6.00031 19.5V4.5C6.00031 4.224 6.24931 4 6.55531 4H11.0003V8.15C11.0003 9.722 12.2173 11 13.7143 11H18.0003V19.5C18.0003 19.776 17.7503 20 17.4443 20ZM17.6493 9H13.7143C13.3203 9 13.0003 8.619 13.0003 8.15V4H13.1123L17.6493 9ZM19.7403 8.328L14.2963 2.328C14.1073 2.119 13.8383 2 13.5553 2H6.55531C5.14631 2 4.00031 3.122 4.00031 4.5V19.5C4.00031 20.878 5.14631 22 6.55531 22H17.4443C18.8533 22 20.0003 20.878 20.0003 19.5V9C20.0003 8.751 19.9073 8.512 19.7403 8.328Z" fill={this.props.color || "#2A8BF2"}/>
                    </mask>
                    <g mask="url(#mask0_1_512)">
                        <g id="&#240;&#159;&#142;&#168; Color">
                            <rect id="Base" width="24" height="24" fill={this.props.color || "#2A8BF2"}/>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
}

export default IconFileInChat;
