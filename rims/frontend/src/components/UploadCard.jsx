import React, { useState } from 'react';
import { UploadCloud, FileAudio, XCircle, AlertCircle } from 'lucide-react';

const UploadCard = ({ onAnalyze, isAnalyzing }) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        validateAndSetFile(selectedFile);
    };

    const validateAndSetFile = (selectedFile) => {
        if (!selectedFile) return;

        const validTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/x-wav'];
        if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.wav') && !selectedFile.name.endsWith('.mp3')) {
            setError('Please upload a valid .wav or .mp3 audio file.');
            setFile(null);
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB Limit
            setError('File size too large. Please upload a file smaller than 10MB.');
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setError(null);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const selectedFile = e.dataTransfer.files[0];
        validateAndSetFile(selectedFile);
    };

    const clearFile = () => {
        setFile(null);
        setError(null);
    };

    return (
        <div className="card upload-card-container">
            <h3>Urban Acoustic Feed</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
                Sync a 10-second acoustic sample to monitor real-time urban health indicators and acoustic biomarkers.
            </p>

            <div
                className={`upload-dropzone ${isDragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
            >
                {!file ? (
                    <div className="upload-empty">
                        <UploadCloud size={48} color="var(--color-primary)" />
                        <p>Drag and drop your audio file here or</p>
                        <label className="btn btn-secondary" style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
                            Browse Files
                            <input
                                type="file"
                                accept=".wav,.mp3"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </label>
                        <p className="upload-types-info">Supports WAV, MP3 (Max 10MB)</p>
                    </div>
                ) : (
                    <div className="upload-file-info">
                        <FileAudio size={40} color="var(--color-primary)" />
                        <div className="file-details">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <button className="btn-icon" onClick={clearFile} disabled={isAnalyzing}>
                            <XCircle size={20} />
                        </button>
                    </div>
                )}
            </div>

            {error && (
                <div className="error-box">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <button
                className="btn btn-primary btn-block"
                style={{ marginTop: '1.5rem', width: '100%', height: '3.5rem' }}
                disabled={!file || isAnalyzing}
                onClick={() => onAnalyze(file)}
            >
                {isAnalyzing ? 'Synchronizing sentinel data...' : 'Initialize Sentinel Search'}
            </button>
        </div>
    );
};

export default UploadCard;
