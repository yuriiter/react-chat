import { Component, React } from 'react';
import { Provider } from 'react-redux';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import ChatView from './views/ChatView';
import SignUp from './views/SignUp';
import SignIn from './views/SignIn';

import { store as rootStore } from './store';

import './sass/_main.scss';

class App extends Component {
  render() {
    return (
      <Provider store={rootStore}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route path="chat" element={<ChatView />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="signin" element={<SignIn />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
