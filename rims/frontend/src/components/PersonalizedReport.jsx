import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Loader2, AlertCircle, Info, ChevronRight } from 'lucide-react';

const PersonalizedReport = ({ analysisResult, airQualityData }) => {
    const [report, setReport] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateReport = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    analysis_result: analysisResult,
                    air_quality: airQualityData
                }),
            });

            if (!response.ok) throw new Error('Failed to generate professional synthesis');

            const data = await response.json();
            setReport(data.report);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (analysisResult) {
            generateReport();
        }
    }, [analysisResult]);

    if (isLoading) {
        return (
            <div style={{
                marginTop: '1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '1.25rem',
                padding: '3rem',
                textAlign: 'center',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                maxWidth: '900px',
                margin: '1.5rem auto 0'
            }}>
                <Loader2 className="spin-animation" size={32} color="#3b82f6" style={{ margin: '0 auto 1rem' }} />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b' }}>Generating Sentinel Synthesis...</h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>Sentinel AI is cross-referencing acoustic signatures with urban environmental metadata.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                marginTop: '1.5rem',
                backgroundColor: '#fef2f2',
                borderRadius: '1.25rem',
                padding: '1.5rem 2rem',
                border: '1px solid #fee2e2',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                maxWidth: '900px',
                margin: '1.5rem auto 0'
            }}>
                <AlertCircle size={20} color="#ef4444" />
                <p style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: '500' }}>{error}</p>
                <button
                    onClick={generateReport}
                    style={{
                        marginLeft: 'auto',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#dc2626',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
                width: '100%',
                marginTop: '1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '1.25rem',
                boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
                border: '1px solid #f1f5f9',
                overflow: 'hidden'
            }}
        >
            <div style={{
                backgroundColor: '#f8fafc',
                padding: '1rem 2rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <Sparkles size={18} color="#3b82f6" />
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', letterSpacing: '0.025em' }}>
                    SENTINEL ACOUSTIC SYNTHESIS
                </h3>
                <div style={{
                    marginLeft: 'auto',
                    padding: '0.25rem 0.625rem',
                    backgroundColor: '#eff6ff',
                    color: '#3b82f6',
                    borderRadius: '2rem',
                    fontSize: '0.7rem',
                    fontWeight: '800'
                }}>
                    SENTINEL REPORT
                </div>
            </div>

            <div style={{ padding: '32px' }}>
                <div style={{
                    color: '#334155',
                    fontSize: '1.0625rem',
                    lineHeight: '1.8',
                    whiteSpace: 'pre-wrap'
                }}>
                    {report}
                </div>

                <div style={{
                    marginTop: '32px',
                    padding: '20px 24px',
                    backgroundColor: '#fffbeb',
                    borderRadius: '1rem',
                    border: '1px solid #fef3c7',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem'
                }}>
                    <div style={{ color: '#d97706', marginTop: '0.25rem' }}>
                        <Info size={18} />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: '#92400e', marginBottom: '0.25rem' }}>Sentinel Disclaimer</h4>
                        <p style={{ fontSize: '0.8125rem', color: '#b45309', lineHeight: '1.5' }}>
                            This automated synthesis is for informational purposes only. It is not a clinical diagnosis. If you detect anomalous health trends, consult a medical professional for individual assessment.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PersonalizedReport;
