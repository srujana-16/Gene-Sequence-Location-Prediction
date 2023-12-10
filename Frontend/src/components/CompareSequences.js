import React, { useEffect, useState } from 'react';
import './CompareSequences.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// This component houses the code for the Compare Sequences page that allows users to upload two sequence files
// and compare them to calculate alignment scores.
function CompareSequences() {

    // State to store the selected files
    const [selectedFile1, setSelectedFile1] = useState(null);
    const [selectedFile2, setSelectedFile2] = useState(null);

    // State to store the first few lines of the selected files
    const [fileContent1, setFileContent1] = useState('');
    const [fileContent2, setFileContent2] = useState('');

    // State to store the alignment score
    const [AlignmentScore, setAlignmentScore] = useState(null);

    // State to store the loading status while the alignment score is being calculated at the backend
    const [loading, setLoading] = useState(false);

    // Function to handle the file upload
    const handleFileChange1 = (e) => {
        const file = e.target.files[0];
        setSelectedFile1(file);

        // If the file is selected, read the first few lines of the file and store it in the state
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const contents = event.target.result;
                const firstFewLines = contents.split('\n').slice(0, 3).join('\n');
                setFileContent1(firstFewLines);
            };

            // Read the file as text
            reader.readAsText(file);
        }
    };

    // Function to handle the file upload
    const handleFileChange2 = (e) => {
        const file = e.target.files[0];
        setSelectedFile2(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const contents = event.target.result;
                const firstFewLines = contents.split('\n').slice(0, 3).join('\n');
                setFileContent2(firstFewLines);
            };
            reader.readAsText(file);
        }
    };

    // Function to handle the compare sequences button click
    const handleCompareSequences = async () => {

        // If two files are selected, send a POST request to the backend to calculate the alignment score
        if (selectedFile1 && selectedFile2) {
            try {

                // Set loading to true while the alignment score is being calculated
                setLoading(true);

                // Create a FormData object to send the files to the backend
                const formData = new FormData();
                formData.append('file1', selectedFile1);
                formData.append('file2', selectedFile2);
                
                // Send a POST request to the backend to calculate the alignment score
                const response = await axios.post('http://localhost:8000/align_seq', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Store the alignment score in the state
                const alignmentScore = response.data;

                // Set the alignment score in the state
                setAlignmentScore(alignmentScore.score);
            } catch (error) {
                console.log(error);
            } finally {
                // Set loading to false once the alignment score is calculated
                setLoading(false);
            }
        } else {
            // If two files are not selected, show an alert to the user
            alert('Please select two files to compare.');
        }
    };

    // UseEffect hook to log the alignment score to the console for debugging purposes
    useEffect(() => {
        if (AlignmentScore) {
            console.log('AlignmentScore', AlignmentScore);
        }
    }, [AlignmentScore]);

    return (
        <div className="App">
            <div className="compare-genome-section">
                <div className="compare-genome-section-title">
                    Compare Sequences
                    <p className="compare-genome-section-intro">
                        Upload two sequence files to compare them and calculate alignment scores.
                    </p>
                </div>

                <div className="compare-sections">
                    <div className="compare-file-content-box">
                        <h3>File 1</h3>
                        {fileContent1 && (
                            <div className="compare-file-content">
                                <p>{fileContent1}</p>
                            </div>
                        )}
                    </div>

                    <div className="compare-file-content-box">
                        <h3>File 2</h3>
                        {fileContent2 && (
                            <div className="compare-file-content">
                                <p>{fileContent2}</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="compare-button-wrapper">
                    <label className="compare-upload-button">
                        <input
                            type="file"
                            accept=".txt, .fasta"
                            onChange={handleFileChange1}
                        />
                        <span>Select File 1</span>
                    </label>
                    <button className="compare-button" onClick={handleCompareSequences}>
                        Compare Sequences
                    </button>
                    <label className="compare-upload-button">
                        <input
                            type="file"
                            accept=".txt, .fasta"
                            onChange={handleFileChange2}
                        />
                        <span>Select File 2</span>
                    </label>
                </div>
                <div className="compare-score-box">
                    {loading ? (
                        <h3>Loading alignment score...</h3>
                    ) : AlignmentScore === null ? (
                        <h3>Upload two sequences.</h3>
                    ) : (
                        <h3>The alignment score is {AlignmentScore}.</h3>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CompareSequences;
