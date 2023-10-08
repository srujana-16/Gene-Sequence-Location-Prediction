import React, { useState } from 'react';
import './App.css';
import Switch from 'react-switch';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <div className="title-bar">
        <h1>Genome Sequencing</h1>
        <label className="dark-mode-label">
          <span>Dark Mode</span>
          <Switch
            onChange={toggleDarkMode}
            checked={darkMode}
            onColor="#007acc"
            offColor="#ccc"
            checkedIcon={false}
            uncheckedIcon={false}
          />
        </label>
      </div>
      <nav className="navigation">
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <div className="file-upload">
        <label className="upload-button">
          <input
            type="file"
            accept=".txt, .fasta, .fastq"
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the default input element
          />
          <span>Select File</span>
        </label>
        {selectedFile && <p>Selected File: {selectedFile.name}</p>}
      </div>
    </div>
  );
}

export default App;
