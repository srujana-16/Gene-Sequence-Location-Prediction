import React, { useState } from 'react';
import './App.css';
import Login from './components/Login';
import MainContent from './MainContent';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Callback function to set the user as logged in
  const handleLogin = () => {
    setIsLoggedIn(true);
  };


  // Callback function to set the user as logged out
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      setIsLoggedIn(false);
      window.location.href = '/login';
    }
  };

  return (
    <div className="app">
      {isLoggedIn && (
        <div className="logout-button" onClick={handleLogout}>
          Logout
        </div>
      )}

      <div className="content">
        {isLoggedIn ? (
          <MainContent />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </div>
    </div>
  );
}

export default App;
