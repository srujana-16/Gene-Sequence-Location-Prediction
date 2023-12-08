import React, { useState } from 'react';
import './CompareSequences.css';

function CompareSequences() {
    const [selectedFile1, setSelectedFile1] = useState(null);
    const [selectedFile2, setSelectedFile2] = useState(null);
    const [fileContent1, setFileContent1] = useState('');
    const [fileContent2, setFileContent2] = useState('');
    const [comparisonResult, setComparisonResult] = useState('');

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

    const handleCompareSequences = () => {
        if (fileContent1 && fileContent2) {
           // alignment algorithm
        }
    };

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
                        <label className="compare-upload-button">
                            <input
                                type="file"
                                accept=".txt, .fasta, .fastq"
                                onChange={handleFileChange1}
                            />
                            <span>Select File</span>
                        </label>
                    </div>

                    <div className="compare-file-content-box">
                        <h3>File 2</h3>

                        {fileContent2 && (
                            <div className="compare-file-content">
                                <p>{fileContent2}</p>
                            </div>
                        )}
                        <label className="compare-upload-button">
                            <input
                                type="file"
                                accept=".txt, .fasta, .fastq"
                                onChange={handleFileChange2}
                            />
                            <span>Select File</span>
                        </label>
                    </div>
                </div>

                <div className="compare-button-wrapper">
                    <button className="compare-button" onClick={handleCompareSequences}>
                        Compare Sequences
                    </button>
                    <div className="comparison-result">
                        {comparisonResult && <p>{comparisonResult}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompareSequences;
