import React, { useState } from 'react';
import { Sparkles, Loader } from 'lucide-react';

const PersonalizedReport = ({ analysisResult, airQualityData }) => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateReport = async () => {
        if (!airQualityData) {
            setError('Please wait for air quality data to load');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/generate-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    analysis: {
                        risk_level: analysisResult.risk_level,
                        confidence: analysisResult.confidence,
                        explanation: analysisResult.explanation
                    },
                    air_quality: airQualityData
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const data = await response.json();
            setReport(data.report);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!report && !loading && !error) {
        return (
            <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem', textAlign: 'center' }}>
                <Sparkles size={32} color="#3b82f6" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Get AI-Powered Personalized Report
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    Combine your respiratory analysis with local air quality data for comprehensive health insights
                </p>
                <button 
                    className="btn btn-primary" 
                    onClick={generateReport}
                    style={{ margin: '0 auto' }}
                >
                    <Sparkles size={16} style={{ marginRight: '0.5rem' }} />
                    Generate Report
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="card" style={{ padding: '2rem', marginTop: '1.5rem', textAlign: 'center' }}>
                <Loader size={32} color="#3b82f6" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Generating your personalized report...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem', backgroundColor: '#fef2f2', border: '1px solid #fee2e2' }}>
                <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="card" style={{ padding: '1.5rem', marginTop: '1.5rem', backgroundColor: '#f0f9ff', border: '2px solid #bfdbfe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Sparkles size={20} color="#3b82f6" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1e293b' }}>
                    Personalized Health Report
                </h3>
            </div>
            <div style={{ 
                color: '#475569', 
                fontSize: '0.9375rem', 
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap'
            }}>
                {report}
            </div>
        </div>
    );
};

export default PersonalizedReport;
