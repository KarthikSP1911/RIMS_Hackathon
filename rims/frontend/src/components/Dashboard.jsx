import React, { useState } from 'react';
import {
    ArrowLeft,
    AlertCircle,
    RefreshCw,
    ChevronRight
} from 'lucide-react';
import UploadCard from './UploadCard';
import ResultCard from './ResultCard';
import LoadingSpinner from './LoadingSpinner';
import HistoryChart from './HistoryChart';
import AirQualityCard from './AirQualityCard';
import PersonalizedReport from './PersonalizedReport';
import { motion } from 'framer-motion';

const Dashboard = ({ onBack }) => {
    const [view, setView] = useState('upload'); // 'upload', 'loading', 'result', 'error'
    const [analysisResult, setAnalysisResult] = useState(null);
    const [errorHeader, setErrorHeader] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [airQualityData, setAirQualityData] = useState(null);

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

            // Simulate result loading to show state transitions
            setTimeout(() => {
                setAnalysisResult({
                    risk_level: data.risk_level,
                    confidence: data.confidence || 0,
                    explanation: data.recommendation || 'Sentinel analysis complete. The acoustic signature has been synchronized with the urban health database.',
                    suggestions: [
                        data.recommendation || 'Follow the recommendation provided.',
                        'Monitor your breathing patterns regularly.',
                        'Consult a healthcare provider if symptoms persist.'
                    ],
                    features: data.features,
                    processing_time: data.processing_time_ms
                });
                setView('result');
            }, 3000); // 3s total steps reveal in LoadingSpinner

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
        <div className="dashboard-page" style={{ paddingTop: '4.5rem', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Main Dashboard Content */}
            <main className="dashboard-main container">
                {view === 'result' && analysisResult && (
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <motion.nav
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            style={{
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                marginLeft: '-0.5rem'
                            }}
                        >
                            <button
                                onClick={resetAnalysis}
                                className="breadcrumb-button"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748b',
                                    fontSize: '0.8125rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                Dashboard
                            </button>
                            <ChevronRight size={14} color="#cbd5e1" />
                            <button
                                onClick={resetAnalysis}
                                className="breadcrumb-button"
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748b',
                                    fontSize: '0.8125rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '0.5rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}
                            >
                                Analysis
                            </button>
                            <ChevronRight size={14} color="#cbd5e1" />
                            <span style={{
                                color: '#0f172a',
                                fontSize: '0.8125rem',
                                fontWeight: '800',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                padding: '0.25rem 0.5rem'
                            }}>
                                Result
                            </span>
                        </motion.nav>

                        <div className="result-view-container" style={{ paddingBottom: '4rem' }}>
                            <ResultCard result={analysisResult} />

                            <PersonalizedReport
                                analysisResult={analysisResult}
                                airQualityData={airQualityData}
                            />
                        </div>
                    </div>
                )}

                {view !== 'result' && (
                    <motion.div
                        className="dashboard-header"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ textAlign: 'center', marginBottom: '3rem' }}
                    >
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>UrbanVoice Acoustic Sentinel</h1>
                        <p style={{ color: '#64748b', fontSize: '1.125rem' }}>Monitor urban acoustic health markers through our advanced semantic intelligence.</p>
                    </motion.div>
                )}

                <div className="dashboard-grid">
                    {view === 'upload' && (
                        <motion.div
                            className="analyze-view"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4 }}
                            style={{ maxWidth: '600px', margin: '0 auto' }}
                        >
                            <UploadCard onAnalyze={handleAnalyze} isAnalyzing={false} />
                            <div style={{ marginTop: '2rem' }}>
                                <AirQualityCard onDataUpdate={setAirQualityData} />
                            </div>
                        </motion.div>
                    )}

                    {view === 'loading' && (
                        <div className="loading-view fade-in-up">
                            <div className="card loading-card" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem' }}>
                                <LoadingSpinner message="Synchronizing urban acoustic metadata..." />
                            </div>
                        </div>
                    )}


                    {view === 'error' && (
                        <div className="error-view fade-in">
                            <div className="card error-card" style={{ textAlign: 'center', padding: '4rem' }}>
                                <div style={{
                                    width: '64px',
                                    height: '64px',
                                    backgroundColor: '#fef2f2',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem'
                                }}>
                                    <AlertCircle size={32} color="#ef4444" />
                                </div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{errorHeader}</h2>
                                <p style={{ color: '#64748b', marginBottom: '2rem' }}>{errorMessage}</p>
                                <button className="btn btn-primary" onClick={resetAnalysis} style={{ margin: '0 auto' }}>
                                    <RefreshCw size={16} style={{ marginRight: '0.5rem' }} />
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
