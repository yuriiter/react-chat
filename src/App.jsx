import { Component } from 'react'
import {Provider} from "react-redux"

import ChatView from "./views/ChatView";

import {store as rootStore} from "./store"

import "./sass/_main.scss"


class App extends Component {
  render () {
    return (
        <Provider store={rootStore}>
          <div>
            <ChatView />
          </div>
        </Provider>
    )
  }
}

export default App