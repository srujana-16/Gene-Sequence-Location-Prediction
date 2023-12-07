import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import Switch from 'react-switch';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import Chart from 'chart.js/auto';

function MainContent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const aboutUsRef = useRef(null);
    const [fileContent, setFileContent] = useState('');
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [predictionData, setPredictionData] = useState(null);
    const [predictionClose, setPredictionClose] = useState(true);
    const [mostLikelyLocation, setMostLikelyLocation] = useState(null);

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
        if (selectedFile) {
            try {
                const formData = new FormData();
                formData.append('file', selectedFile);

                const response = await axios.post('http://localhost:8000/send_seq', formData);
                const prediction = response.data;

                // Update the state with the prediction data
                setPredictionData(prediction);
                setPredictionClose(false);
                const labels = Object.keys(prediction);
                mostLikelyLocation = labels[0];
                console.log(mostLikelyLocation);

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
                            position: 'right'
                        }
                    }
                }
            });
        }

    };

    // log predictionData
    useEffect(() => {
        // This will run every time predictionData changes
        console.log("Prediction Data has been updated:", predictionData);
        if (predictionData && !predictionClose) {
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
                    <li>Data Visualization</li>
                    <li onClick={scrollToAboutUs}>About Us</li>
                </ul>
            </nav>

            <div className="genome-section">
                <div className="genome-section-title">
                    Sequence Location Prediction
                </div>
                {predictionClose && (
                    <div className={`file-content-box`}>
                        {(selectedFile && fileContent) ? (
                            <h3> Sequence uploaded.</h3>) :
                            (<h3> No file selected.</h3>
                            )}
                        <div className={`file-content`}>
                            <p>{fileContent}</p>
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
