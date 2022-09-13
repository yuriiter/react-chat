import { Component } from 'react'

import ChatView from "./views/ChatView";

import "./sass/_main.scss"


class App extends Component {
  render () {
    return (
      <div>
        <ChatView />
      </div>
    )
  }
}

export default App
