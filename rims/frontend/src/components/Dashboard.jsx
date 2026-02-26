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

const Dashboard = ({ onBack }) => {
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
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', errorData);
                throw new Error(errorData.detail || 'Analysis service error');
            }

            const data = await response.json();
            console.log('API Response:', data);

            // Check if we got valid data
            if (!data || data.risk_level === 'ERROR') {
                console.error('Analysis error from backend:', data);
                throw new Error(data.error || 'Analysis failed on the server');
            }
            
            if (!data.risk_level) {
                console.error('Invalid response data:', data);
                throw new Error('Invalid response from server');
            }

            // Simulating a minor delay for better UX
            setTimeout(() => {
                setAnalysisResult({
                    risk_level: data.risk_level,
                    confidence: data.confidence || 0,
                    explanation: data.recommendation || 'Analysis complete. The AI has assessed your respiratory patterns.',
                    suggestions: [
                        data.recommendation || 'Follow the recommendation provided.',
                        'Monitor your breathing patterns regularly.',
                        'Consult a healthcare provider if symptoms persist.'
                    ],
                    features: data.features,
                    processing_time: data.processing_time_ms
                });
                setView('result');
            }, 1500);

        } catch (err) {
            console.error('Analysis error:', err);
            setErrorHeader('Analysis Failed');
            setErrorMessage(err.message || 'The AI was unable to process your audio sample. Please ensure the recording is clear and in a supported format.');
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
                        <button onClick={onBack} className="dash-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                            <ArrowLeft size={18} />
                            Back to Home
                        </button>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <button 
                            onClick={onBack} 
                            className="btn btn-secondary"
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}
                        >
                            <ArrowLeft size={18} />
                            Back to Home
                        </button>
                    </div>
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
                            {analysisResult.risk_level && analysisResult.risk_level !== 'ERROR' ? (
                                <>
                                    <ResultCard result={analysisResult} />
                                </>
                            ) : (
                                <div className="card error-card">
                                    <AlertCircle size={48} color="#ef4444" />
                                    <h2>Invalid Result</h2>
                                    <p>The analysis completed but returned invalid data.</p>
                                    <pre style={{ fontSize: '0.75rem', textAlign: 'left', background: '#f1f5f9', padding: '1rem', borderRadius: '0.5rem', overflow: 'auto' }}>
                                        {JSON.stringify(analysisResult, null, 2)}
                                    </pre>
                                    <button className="btn btn-primary" onClick={resetAnalysis}>
                                        <RefreshCw size={16} />
                                        <span>Try Again</span>
                                    </button>
                                </div>
                            )}
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
