import React, { useState } from 'react';
import {
    HeartPulse,
    History,
    ArrowLeft,
    AlertCircle,
    RefreshCw
} from 'lucide-react';
import UploadCard from './UploadCard';
import ResultCard from './ResultCard';
import LoadingSpinner from './LoadingSpinner';
import HistoryChart from './HistoryChart';

const Dashboard = () => {
    const [view, setView] = useState('upload'); // 'upload', 'loading', 'result', 'error'
    const [analysisResult, setAnalysisResult] = useState(null);
    const [errorHeader, setErrorHeader] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleAnalyze = async (file) => {
        setView('loading');

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);

        try {
            // API call to backend
            const response = await fetch('http://localhost:8000/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Analysis service error');
            }

            const data = await response.json();

            // Simulating a minor delay for better UX
            setTimeout(() => {
                setAnalysisResult({
                    risk_level: data.risk_level || 'Moderate',
                    confidence: data.confidence || 75,
                    explanation: data.explanation || 'The AI detected patterns often associated with mild respiratory distress. This can be caused by various environmental or physiological factors.',
                    suggestions: data.suggestions || [
                        'Monitor your oxygen levels if possible.',
                        'Consult with a healthcare provider for a thorough examination.',
                        'Stay hydrated and avoid strenuous activities.'
                    ]
                });
                setView('result');
            }, 1500);

        } catch (err) {
            setErrorHeader('Analysis Failed');
            setErrorMessage('The AI was unable to process your audio sample. Please ensure the recording is clear and in a supported format.');
            setView('error');
        }
    };

    const resetAnalysis = () => {
        setView('upload');
        setAnalysisResult(null);
    };

    return (
        <div className="dashboard-container">
            {/* Dashboard Navbar */}
            <nav className="dashboard-nav">
                <div className="container">
                    <div className="nav-brand">
                        <HeartPulse size={24} color="var(--color-primary)" />
                        <span>Respira<span className="brand-scan">Scan</span></span>
                    </div>

                    <div className="dashboard-links">
                        <a href="#" className="dash-link active">Analyze</a>
                        <a href="#" className="dash-link">History</a>
                    </div>

                    <div className="nav-actions">
                        <button className="btn-signin">Sign In</button>
                    </div>
                </div>
            </nav>

            {/* Main Dashboard Content */}
            <main className="dashboard-main container">
                <div className="dashboard-header">
                    <h1>Respiratory Risk Analysis</h1>
                    <p>Assess your breathing patterns using our advanced AI biomarkers.</p>
                </div>

                <div className="dashboard-grid">
                    {view === 'upload' && (
                        <div className="analyze-view fade-in">
                            <UploadCard onAnalyze={handleAnalyze} isAnalyzing={false} />
                        </div>
                    )}

                    {view === 'loading' && (
                        <div className="loading-view fade-in">
                            <div className="card loading-card">
                                <LoadingSpinner message="Analyzing respiratory signals..." />
                                <div className="loading-steps">
                                    <div className="step active">Extracting acoustic features</div>
                                    <div className="step">Running neural network analysis</div>
                                    <div className="step">Generating risk assessment</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {view === 'result' && analysisResult && (
                        <div className="result-view fade-in">
                            <div className="result-actions">
                                <button className="btn-text" onClick={resetAnalysis}>
                                    <ArrowLeft size={16} />
                                    <span>Analyze New Sample</span>
                                </button>
                            </div>
                            <ResultCard result={analysisResult} />

                            <div style={{ marginTop: '2.5rem' }}>
                                <HistoryChart />
                            </div>
                        </div>
                    )}

                    {view === 'error' && (
                        <div className="error-view fade-in">
                            <div className="card error-card">
                                <AlertCircle size={48} color="#ef4444" />
                                <h2>{errorHeader}</h2>
                                <p>{errorMessage}</p>
                                <button className="btn btn-primary" onClick={resetAnalysis}>
                                    <RefreshCw size={16} />
                                    <span>Try Again</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
