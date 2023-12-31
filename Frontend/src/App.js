import React, { useState } from 'react';
import './components/App.css';
import Login from './components/Login';
import MainContent from './components/MainContent';
import DataVisualization from './components/DataVisualization';
import CompareSequences from './components/CompareSequences';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

function App() {

  // State to check if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Callback function to set the user as logged in
  const handleLogin = () => {
    setIsLoggedIn(true);
  };


  // Callback function to set the user as logged out
  const handleLogout = () => {

    // Ask the user to confirm if they want to logout
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {

      // Set the user as logged out
      setIsLoggedIn(false);

      // Redirect the user to the login page
      window.location.href = '/';
    }
  };

  return (
    <Router>
      <div className="app">
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
          </link>
        </head>

        {/* If the user is logged in, show the logout button */}
        {isLoggedIn && (
          <div className="logout-button" onClick={handleLogout}>
            Logout
          </div>
        )}

        {/* Routes to different components */}
        <div className="content">
          <Switch>
            <Route exact path="/">
              {/** If the user is logged in, show the main content, else show the login component */}
              {isLoggedIn ? <MainContent /> : <Login onLogin={handleLogin} />}
            </Route>
            <Route exact path="/data-visualization" component={DataVisualization} />
            <Route exact path="/compare-sequences" component={CompareSequences} />
          </Switch>
        </div>
        <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
      </div>
    </Router>

  );
}

export default App;
