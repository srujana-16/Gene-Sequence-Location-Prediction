import React, { useEffect, useState } from 'react';
import './CompareSequences.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function CompareSequences() {
    const [selectedFile1, setSelectedFile1] = useState(null);
    const [selectedFile2, setSelectedFile2] = useState(null);
    const [fileContent1, setFileContent1] = useState('');
    const [fileContent2, setFileContent2] = useState('');
    const [AlignmentScore, setAlignmentScore] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange1 = (e) => {
        const file = e.target.files[0];
        setSelectedFile1(file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const contents = event.target.result;
                const firstFewLines = contents.split('\n').slice(0, 3).join('\n');
                setFileContent1(firstFewLines);
            };
            reader.readAsText(file);
        }
    };

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

    const handleCompareSequences = async () => {
        if (selectedFile1 && selectedFile2) {
            try {
                setLoading(true); // Set loading to true when starting the request

                const formData = new FormData();
                formData.append('file1', selectedFile1);
                formData.append('file2', selectedFile2);

                const response = await axios.post('http://localhost:8000/align_seq', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const alignmentScore = response.data;
                setAlignmentScore(alignmentScore.score);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false); // Set loading to false after the request is completed
            }
        } else {
            alert('Please select two files to compare.');
        }
    };

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
                            accept=".txt, .fasta, .fastq"
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
                            accept=".txt, .fasta, .fastq"
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
