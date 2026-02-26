import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, ArrowRight } from 'lucide-react';
import RiskMeter from './RiskMeter';

const ResultCard = ({ result }) => {
    const { risk_level, confidence, explanation, suggestions } = result;

    const getRiskStyles = () => {
        const level = risk_level.toLowerCase().replace(' risk', '').trim();
        switch (level) {
            case 'low': return {
                color: '#10b981',
                bg: '#ecfdf5',
                border: '#d1fae5',
                icon: CheckCircle,
                label: 'Low Risk'
            };
            case 'moderate': return {
                color: '#f59e0b',
                bg: '#fffbeb',
                border: '#fef3c7',
                icon: AlertTriangle,
                label: 'Moderate Risk'
            };
            case 'high': return {
                color: '#ef4444',
                bg: '#fef2f2',
                border: '#fee2e2',
                icon: AlertTriangle,
                label: 'High Risk'
            };
            default: return {
                color: '#3b82f6',
                bg: '#eff6ff',
                border: '#dbeafe',
                icon: Info,
                label: risk_level || 'Unknown Risk'
            };
        };
    };

    const styles = getRiskStyles();
    const Icon = styles.icon;

    return (
        <motion.div
            className="card result-card-container"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="result-header">
                <motion.div
                    className="risk-badge"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        backgroundColor: styles.bg,
                        color: styles.color,
                        border: `1px solid ${styles.border}`,
                        padding: '0.4rem 0.75rem',
                        borderRadius: '2rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '700',
                        fontSize: '0.875rem'
                    }}
                >
                    <Icon size={16} />
                    {styles.label.toUpperCase()}
                </motion.div>
                <span className="timestamp" style={{ fontSize: '0.75rem', opacity: 0.5 }}>Analysis complete</span>
            </div>

            <div className="result-body">
                <div className="result-summary" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                    <RiskMeter confidence={confidence} riskLevel={risk_level} />
                    <motion.div
                        className="risk-statement"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                            {risk_level.toUpperCase()}
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.5' }}>
                            The AI has detected <span style={{ color: styles.color, fontWeight: 700 }}>{risk_level.toLowerCase()}</span> acoustic indicators of respiratory abnormality in your sample.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    className="explanation-section"
                    style={{ marginTop: '2.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem' }}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
                        <Info size={18} />
                        Clinical Insights
                    </h4>
                    <div className="explanation-content" style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                        <p style={{ color: '#475569', fontSize: '0.9375rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                            {explanation || `Based on the frequency and intensity of acoustic biomarkers, your recorded sample indicates a ${risk_level.toLowerCase()} probability of respiratory distress.`}
                        </p>
                        <div className="suggestions">
                            <strong style={{ display: 'block', fontSize: '0.875rem', color: '#1e293b', marginBottom: '0.5rem' }}>Recommended Actions:</strong>
                            <ul style={{ paddingLeft: '0', listStyle: 'none' }}>
                                {(suggestions || ['Consider clinical consultation if symptoms persist.', 'Monitor your breathing patterns.', 'Keep your analysis history for future reference.']).map((s, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#64748b', marginBottom: '0.4rem' }}>
                                        <ArrowRight size={14} style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ResultCard;
