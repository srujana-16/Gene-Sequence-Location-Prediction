import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Switch from 'react-switch';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Chart from 'chart.js/auto';
import { Link } from 'react-router-dom';
import MapComponent from './components/MapComponent';

function MainContent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const aboutUsRef = useRef(null);
    const [fileContent, setFileContent] = useState('');
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [predictionData, setPredictionData] = useState(null);
    const [predictionClose, setPredictionClose] = useState(true);
    const [mostLikelyLocation, setMostLikelyLocation] = useState(null);
    const [manualSequence, setManualSequence] = useState('');
    const [typingMode, setTypingMode] = useState(false);


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
        setTypingMode(false);
    };


    const handleFileContentChange = (e) => {
        setFileContent(e.target.value);
        setSelectedFile(null);
    };

    // Enable typing mode
    const handleTypeSequence = () => {        
        setTypingMode(true);
        setSelectedFile(null);
        setFileContent('');
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

        if (scrollPosition > documentHeight - windowHeight - 200) {
            setShowAboutUs(true);
        } else {
            setShowAboutUs(false);
        }
    };

    const handlePredict = async () => {
        if (selectedFile || typingMode) {
            try {
                const formData = new FormData();

                if (selectedFile) {
                    formData.append('file', selectedFile);
                }
                else if (typingMode) {
                    
                    const Content = document.querySelector('.file-content textarea').value;
                    setFileContent(Content);
                    setManualSequence(fileContent);
                    const file = new File([Content], 'manualSequence.txt', { type: 'text/plain' });
                    formData.append('file', file);
                }

                const response = await axios.post('http://localhost:8000/send_seq', formData);
                const prediction = response.data;

                // Update the state with the prediction data
                setPredictionData(prediction);
                setPredictionClose(false);
                const labels = Object.keys(prediction);
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
    // function to create chart
    const createChart = () => {
        // Get the chart container
        const chartContainer = document.querySelector('.prediction-chart');

        // Check if the chart container is found
        if (chartContainer) {

            Chart.getChart(chartContainer)?.destroy();
            // remove canvas element if it exists
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

            // Create the chart using Chart.js
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

    // log predictionData
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
                    <li>Home</li>
                    <li><Link to="/data-visualization">Data Visualization</Link></li>
                    <li onClick={scrollToAboutUs}>About Us</li>
                </ul>
            </nav>

            <div className="genome-section">
                <div className="genome-section-title">
                    Sequence Location Prediction
                    <p className="genome-section-intro">
                        Upload your sequence file to predict the location of origin of the sequence.
                    </p>
                </div>
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
                                    accept=".txt, .fasta, .fastq"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <span>Select File</span>
                            </label>
                            <button className="type-sequence-button" onClick={handleTypeSequence}>Type the Sequence</button>
                        </div>
                    </div>
                )}


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
                                <MapComponent location={mostLikelyLocation} />
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/*    
            <div className={`about-us-section ${showAboutUs ? 'visible' : ''}`} ref={aboutUsRef}>
                <h2>About Us</h2>
                <p>
                    Hi! We are Srujana Vanka and Jewel Benny, enthusiastic teammates at IIIT Hyderabad.
                    Our focus is on crafting an innovative AI/ML model and web application that accurately predicts sequence
                    origins or spread. With our collaborative efforts, we strive to make impactful contributions to the
                    domains of bioinformatics and epidemiology. //NEED TO MAKE IT BETTER
                </p>
            </div>
            */}
        </div>
    );
}

export default MainContent;


