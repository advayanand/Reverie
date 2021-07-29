import React, { useState } from 'react';
import './App.css';
import Login from './Login';
import SignUp from './SignUp';
import Home from './Home';
import './styles/Login.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom';
import useToken from './useToken';
import PostPage from './PostPage';

function App() {
  const [ user, setUser ] = useState({});
  const { token, setToken } = useToken();

  const UserContext = React.createContext(token);

  if (!token) {
    return <Login setToken={setToken} />
  }
  return (
    <div className="App">
      <UserContext.Provider value={token}>
        <Router>
          <Switch>
            <Route path='/home' >
              <Home token={token} />
            </Route>
            <Route path='/posts/:post_id'>
              <PostPage token={token}/>
            </Route>
          </Switch>
        </Router>
      </UserContext.Provider>
      
      {/* <SignUp /> */}
    </div>
  );
}

export default App;
