import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import MapComponent from './MapComponent';

// This component houses the code for the main content of the application that allows users to upload a sequence file
// or type a sequence and predict the location of origin of the sequence. This component also houses the redirect buttons
// to the Data Visualization and Compare Sequences pages.
function MainContent() {

    // States to store the selected file and the first few lines of the file
    const [selectedFile, setSelectedFile] = useState(null);

    // State to store the dark mode status (not used in this version of the application)
    const [darkMode, setDarkMode] = useState(false);

    // State to store the reference to the About Us section (not used in this version of the application)
    const aboutUsRef = useRef(null);

    // State to store the selected file content
    const [fileContent, setFileContent] = useState('');

    // State to store the About Us section visibility status (not used in this version of the application)
    const [showAboutUs, setShowAboutUs] = useState(false);

    // State to store the prediction data received from the backend
    const [predictionData, setPredictionData] = useState(null);

    // State to store the state of the prediction box
    const [predictionClose, setPredictionClose] = useState(true);

    // State to store the most likely location
    const [mostLikelyLocation, setMostLikelyLocation] = useState(null);

    // State to store the manual sequence (debugging purposes)
    const [manualSequence, setManualSequence] = useState('');

    // State to store the typing mode status
    const [typingMode, setTypingMode] = useState(false);

    // scroll event listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Function to handle the file upload
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

            // Read the file as text
            reader.readAsText(file);
        }

        // Disable typing mode
        setTypingMode(false);
    };

    // Function to handle the file content change
    const handleFileContentChange = (e) => {
        setFileContent(e.target.value);
        setSelectedFile(null);
    };

    // Enable typing mode
    const handleTypeSequence = () => {

        // Enable typing mode
        setTypingMode(true);

        // Clear the selected file and file content
        setSelectedFile(null);
        setFileContent('');
    };

    // Function to scroll to the About Us section (not used in this version of the application)
    const scrollToAboutUs = () => {
        if (aboutUsRef.current) {
            window.scrollTo({
                behavior: 'smooth',
                top: aboutUsRef.current.offsetTop,
            });
            setShowAboutUs(true);
        }
    };

    // Function to handle the scroll event
    const handleScroll = () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.scrollY;

        if (scrollPosition > documentHeight - windowHeight - 200) {
            setShowAboutUs(true);
        } else {
            setShowAboutUs(false);
        }
    };

    // Function to handle the predict button click
    const handlePredict = async () => {

        // Check if a file is selected or if the user is in typing mode
        // If yes, send a POST request to the backend to predict the location of origin of the sequence
        if (selectedFile || typingMode) {
            try {

                // Create a FormData object to send the file to the backend
                const formData = new FormData();

                if (selectedFile) {
                    formData.append('file', selectedFile);
                }
                else if (typingMode) {

                    // Get the content of the textarea
                    const Content = document.querySelector('.file-content textarea').value;

                    // Set the file content to the textarea content
                    setFileContent(Content);
                    setManualSequence(fileContent);

                    // Create a file from the textarea content
                    const file = new File([Content], 'manualSequence.txt', { type: 'text/plain' });

                    // Append the file to the FormData object
                    formData.append('file', file);
                }
                
                // Send a POST request to the backend to get the location predictions
                const response = await axios.post('http://localhost:8000/send_seq', formData);
                const prediction = response.data;

                // Update the state with the prediction data
                setPredictionData(prediction);

                // toggle predictionClose
                setPredictionClose(false);

                // Get the top locatiobs
                const labels = Object.keys(prediction);

                // Set the most likely location as the first location
                setMostLikelyLocation(labels[0]);
                //console.log(mostLikelyLocation);

            } catch (error) {
                console.error('Error:', error);
            }

        } else {
            console.error('No file selected');
        }
    };

    const handlePredictionButton = () => {
        // toggle predictionClose
        setPredictionClose(true);
    }

    // function to create doughtnut chart to display prediction data
    const createChart = () => {

        // Get the chart container
        const chartContainer = document.querySelector('.prediction-chart');

        // Check if the chart container is found
        if (chartContainer) {

            Chart.getChart(chartContainer)?.destroy();

            // remove canvas element if it exists to prevent multiple charts from being created
            if (chartContainer?.firstChild) {
                chartContainer.removeChild(chartContainer.firstChild);
            }

            // Create a canvas element within the chart container
            const canvas = document.createElement('canvas');

            chartContainer.appendChild(canvas);

            // Get the 2D context of the canvas
            const ctx = canvas.getContext('2d');

            // extract labels and data from predictionData json
            const labels = Object.keys(predictionData);
            const data = Object.values(predictionData);

            // Create the chart using Chart.js and the extracted prediction data
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

    };

    // log predictionData (debugging purposes)
    useEffect(() => {
        if (predictionData && !predictionClose) {
            // This will run every time predictionData changes
            console.log("Prediction Data has been updated:", predictionData);
            createChart();
            const labels = Object.keys(predictionData);
            setMostLikelyLocation(labels[0]);
        }
    }, [predictionData, predictionClose, mostLikelyLocation]);


    return (
        <div className="App">
            <nav className="navigation">
                <ul className="navigation-list">
                    <li><Link to="/data-visualization" className="link-without-underline">Data Visualization</Link></li>
                    <li><Link to="/compare-sequences" className="link-without-underline">Compare Sequences</Link></li>
                    {/*<li><Link to="/about-us" className="link-without-underline">About Us</Link></li>*/}
                </ul>
            </nav>

            <div className="genome-section">
                <div className="genome-section-title">
                    Sequence Location Prediction
                    <p className="genome-section-intro">
                        Upload your sequence file to predict the location of origin of the sequence.
                    </p>
                </div>

                {/* If the user is has not clicked on the predict button, show the file content box */}
                {predictionClose && (
                    <div className={`file-content-box`}>
                        {(selectedFile && fileContent) ? (
                            <h3> Sequence uploaded.</h3>
                        ) : (
                            <h3> No file selected.</h3>
                        )}

                        <div className={`file-content`}>
                            {typingMode ? (
                                <textarea
                                    value={fileContent}
                                    onChange={handleFileContentChange}
                                    placeholder="Type your sequence here..."
                                    style={{
                                        width: '100%',
                                        minHeight: '300px',
                                        resize: 'none',
                                        padding: '10px',
                                        boxSizing: 'border-box',
                                        border: 'none',
                                        outline: 'none',
                                    }}
                                />
                            ) : (
                                <p>{fileContent}</p>
                            )}
                        </div>
                        <div className='button-wrapper'>
                            <button className="predict-button" onClick={handlePredict}>Predict Location</button>
                            <label className="upload-button">
                                <input
                                    type="file"
                                    accept=".txt, .fasta"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <span>Select File</span>
                            </label>
                            <button className="type-sequence-button" onClick={handleTypeSequence}>Type Sequence</button>
                        </div>
                    </div>
                )}

                {/* If the prediction data is available, show the prediction box */}
                {predictionData && !predictionClose && (
                    <div className={`prediction-box`}>
                        <div className='prediction-title-wrapper'>
                            <h3>Prediction Data</h3>
                            <button type="button" class="btn-close" aria-label="Close" onClick={handlePredictionButton}></button>
                        </div>
                        <div className={`prediction-content`}>
                            <div className="prediction-chart">
                            </div>
                            <div className="prediction-text">
                                Your sample is most likely from {mostLikelyLocation}.
                            </div>
                            <div className="prediction-map">
                                {/* The most likely location is displayed on a map */}
                                <MapComponent location={mostLikelyLocation} />
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

export default MainContent;