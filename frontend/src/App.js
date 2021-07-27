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

function App() {
  const [ user, setUser ] = useState({});
  const { token, setToken } = useToken();

  if (!token) {
    return <Login setToken={setToken} />
  }
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/home' >
            <Home token={token} />
          </Route>
        </Switch>
      </Router>
      {/* <SignUp /> */}
    </div>
  );
}

export default App;
