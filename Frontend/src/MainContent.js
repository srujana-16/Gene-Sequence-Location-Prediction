import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Switch from 'react-switch';

function MainContent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const aboutUsRef = useRef(null);
    const [fileContent, setFileContent] = useState('');
    const [showAboutUs, setShowAboutUs] = useState(false);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const contents = event.target.result;
                const firstFewLines = contents.split('\n').slice(0, 3).join('\n');
                setFileContent(firstFewLines);
            };
            reader.readAsText(file);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const scrollToAboutUs = () => {
        if (aboutUsRef.current) {
            window.scrollTo({
                behavior: 'smooth',
                top: aboutUsRef.current.offsetTop,
            });
            setShowAboutUs(true);
        }
    };

    const handleScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition > documentHeight - windowHeight - 100) {
            setShowAboutUs(true);
        } else {
            setShowAboutUs(false);
        }
    };

    useEffect(() => {
        const handleScrollUp = () => {
            const scrollPosition = window.scrollY;

            if (scrollPosition === 0) {
                setShowAboutUs(false);
            }
        };

        window.addEventListener('scroll', handleScrollUp);

        return () => {
            window.removeEventListener('scroll', handleScrollUp);
        };
    }, []);


    return (
        <div className={`App ${darkMode ? 'dark' : ''}`}>
            <nav className="navigation">
                <ul className="navigation-list">
                    <li>Home</li>
                    <li>Data Visualization</li>
                    <li onClick={scrollToAboutUs}>About Us</li>
                </ul>
                <label className="dark-mode-label">
                    <span className="dark-mode-text">Dark Mode</span>
                    <Switch
                        onChange={toggleDarkMode}
                        checked={darkMode}
                        onColor="#007acc"
                        offColor="#ccc"
                        checkedIcon={false}
                        uncheckedIcon={false}
                    />
                </label>
            </nav>

            <div className="genome-section">
                <h1>Genome Sequencing</h1>
                <p>Upload the genome sequence to determine the
                    geographic origin of COVID-19 sample....
                    <br />
                    (basic introduction type ///NEED TO MAKE IT BETTER)</p>
                <label className="upload-button">
                    <input
                        type="file"
                        accept=".txt, .fasta, .fastq"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                    <span>Select File</span>
                </label>
                {selectedFile && fileContent !== '' && (
                    <div className={`file-content-box ${darkMode ? 'dark' : ''}`}>
                        <h3>Genome Sequence Uploaded</h3>
                        <div className={`file-content ${darkMode ? 'dark' : ''}`}>
                            <p>{fileContent}</p>
                        </div>
                        <button className="predict-button">Predict Geographic Location</button>
                    </div>
                )}
            </div>


            {/* About Us section */}
            <div className={`about-us-section ${showAboutUs ? 'visible' : ''}`} ref={aboutUsRef}>
                <h2>About Us</h2>
                <p>
                    Hi! We are Srujana Vanka and Jewel Benny, enthusiastic teammates at IIIT Hyderabad.
                    Our focus is on crafting an innovative AI/ML model and web application that accurately predicts sequence
                    origins or spread. With our collaborative efforts, we strive to make impactful contributions to the
                    domains of bioinformatics and epidemiology. //NEED TO MAKE IT BETTER
                </p>
            </div>
        </div>
    );
}

export default MainContent;
