import React, { useState, useRef } from 'react';
import './App.css';
import Switch from 'react-switch';


function MainContent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const aboutUsRef = useRef(null);
    const [fileContent, setFileContent] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const contents = event.target.result;
                // Splitting the content by newline and extracting the first 2-3 lines
                const firstFewLines = contents.split('\n').slice(0, 3).join('\n');
                setFileContent(firstFewLines);
            };
            reader.readAsText(file);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleLogout = () => {
        const confirmLogout = window.confirm('Are you sure you want to logout?');
        if (confirmLogout) {

            // Redirect to the login page
            window.location.href = '/login';
        }
    };

    const scrollToAboutUs = () => {
        if (aboutUsRef.current) {
            window.scrollTo({
                behavior: 'smooth',
                top: aboutUsRef.current.offsetTop,
            });
        }
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
                    <li>Data Visualization</li>
                    <li onClick={scrollToAboutUs}>About Us</li>
                </ul>
            </nav>
            <div className="file-upload">
                <label className="upload-button">
                    <input
                        type="file"
                        accept=".txt, .fasta, .fastq"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <span>Select File</span>
                </label>
                {selectedFile && <p>Selected File: {selectedFile.name}</p>}
                {fileContent && (
                    <div className={`file-content-box ${darkMode ? 'dark' : ''}`}>
                        <h3>Genome Sequence Uploaded</h3>
                        <div className={`file-content ${darkMode ? 'dark' : ''}`}>
                            <p>{fileContent}</p>
                        </div>
                    </div>
                )}
            </div>
            <button onClick={handleLogout} className="logout-button">
                Logout
            </button>

            {/* About Us section */}
            <div ref={aboutUsRef} className="about-us-section">
                <h2>About Us</h2>
                <h3>IIIT Hyderabad</h3>
                <p>
                    Hi! We are Srujana Vanka and Jewel Benny, enthusiastic teammates at IIIT Hyderabad.
                    Our focus is on crafting an innovative AI/ML model and web application that accurately predicts sequence
                    origins or spread. With our collaborative efforts, we strive to make impactful contributions to the
                    domains of bioinformatics and epidemiology.
                </p>
            </div>

        </div>
    );
}

export default MainContent;
