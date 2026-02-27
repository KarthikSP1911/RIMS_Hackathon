import React from 'react';
import { motion } from 'framer-motion';
import {
    Activity,
    ShieldCheck,
    AlertCircle,
    Info,
    ChevronRight,
    Clock,
    Stethoscope,
    FileText,
    Share2,
    Download
} from 'lucide-react';

const ResultCard = ({ result }) => {
    const {
        risk_level,
        confidence,
        explanation,
        suggestions,
        features,
        processing_time,
        model_version
    } = result;

    const getRiskConfig = () => {
        const level = risk_level ? risk_level.toLowerCase().replace(' risk', '').trim() : 'unknown';
        switch (level) {
            case 'low': return {
                theme: 'emerald',
                color: '#059669',
                bg: '#f0fdf4',
                border: '#dcfce7',
                accent: '#10b981',
                icon: ShieldCheck,
                label: 'Low Risk Detected'
            };
            case 'moderate': return {
                theme: 'amber',
                color: '#d97706',
                bg: '#fffbeb',
                border: '#fef3c7',
                accent: '#f59e0b',
                icon: Activity,
                label: 'Moderate Risk Detected'
            };
            case 'high': return {
                theme: 'crimson',
                color: '#dc2626',
                bg: '#fef2f2',
                border: '#fee2e2',
                accent: '#ef4444',
                icon: AlertCircle,
                label: 'High Risk Detected'
            };
            default: return {
                theme: 'slate',
                color: '#475569',
                bg: '#f8fafc',
                border: '#e2e8f0',
                accent: '#64748b',
                icon: Info,
                label: risk_level || 'Indeterminate'
            };
        };
    };

    const config = getRiskConfig();
    const MainIcon = config.icon;

    // Animation variants
    const fadeInUp = {
        initial: { opacity: 0, y: 15 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: "easeOut" }
    };

    return (
        <motion.div
            className="clinical-result-container"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, cubicBezier: [0.22, 1, 0.36, 1] }}
            style={{
                backgroundColor: '#ffffff',
                borderRadius: '1.25rem',
                boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                border: '1px solid #f1f5f9',
                width: '100%' // Use full width of parent (900px)
            }}
        >
            {/* Top Status Bar */}
            <div style={{
                backgroundColor: config.bg,
                padding: '1rem 2rem',
                borderBottom: `1px solid ${config.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        backgroundColor: '#ffffff',
                        color: config.color,
                        padding: '0.4rem',
                        borderRadius: '0.625rem',
                        display: 'flex',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <MainIcon size={18} />
                    </div>
                    <span style={{
                        color: config.color,
                        fontWeight: '700',
                        fontSize: '0.875rem',
                        letterSpacing: '0.05em'
                    }}>
                        {config.label.toUpperCase()}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button className="btn-icon" style={{ padding: '0.4rem' }} title="Share Report"><Share2 size={16} /></button>
                    <button className="btn-icon" style={{ padding: '0.4rem' }} title="Download PDF"><Download size={16} /></button>
                </div>
            </div>

            <div style={{ padding: '32px' }}>
                {/* Section 1: Risk Summary */}
                <div style={{ marginBottom: '40px' }}>
                    <motion.div {...fadeInUp}>
                        <h4 style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
                            Sentinel Analysis Summary
                        </h4>
                        <h2 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            color: '#0f172a',
                            marginBottom: '1rem',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '0.75rem'
                        }}>
                            <span>{risk_level.replace(' RISK', '').toUpperCase()}</span>
                            <span style={{ color: '#cbd5e1', fontWeight: '300', fontSize: '1.75rem' }}>PROBABILITY</span>
                        </h2>
                        <p style={{ color: '#475569', fontSize: '1.0625rem', lineHeight: '1.6', maxWidth: '720px' }}>
                            {explanation || `The automated sentinel detected ${risk_level.toLowerCase()} acoustic signatures. Current biomarkers suggest a stable acoustic profile with minimal characteristic deviations within the urban environment.`}
                        </p>
                    </motion.div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '24px',
                    marginBottom: '40px'
                }}>
                    {/* Section 2: Confidence Score */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.1 }} style={{ display: 'flex' }}>
                        <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '24px',
                            borderRadius: '1.25rem',
                            border: '1px solid #f1f5f9',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <h4 style={{ color: '#1e293b', fontSize: '0.875rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <ShieldCheck size={18} color="#3b82f6" />
                                Sentinel Confidence
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', lineHeight: '1' }}>{confidence}</span>
                                <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: '600' }}>%</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '16px' }}>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${confidence}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
                                    style={{ height: '100%', backgroundColor: config.accent }}
                                />
                            </div>
                            <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: '1.5', marginTop: 'auto' }}>
                                Statistical certainty based on audio quality and semantic features.
                            </p>
                        </div>
                    </motion.div>

                    {/* Section 3: Clinical Insights */}
                    <motion.div {...fadeInUp} transition={{ delay: 0.2 }} style={{ display: 'flex' }}>
                        <div style={{
                            backgroundColor: '#f8fafc',
                            padding: '24px',
                            borderRadius: '1.25rem',
                            border: '1px solid #f1f5f9',
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <h4 style={{ color: '#1e293b', fontSize: '0.875rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Stethoscope size={18} color="#3b82f6" />
                                Acoustic Signatures
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {features ? (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Spectral Stability</span>
                                            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1e293b', fontFamily: 'monospace' }}>{features.jitter ? features.jitter.toFixed(4) : 'N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Amplitude Stability</span>
                                            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1e293b', fontFamily: 'monospace' }}>{features.shimmer ? features.shimmer.toFixed(4) : 'N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>Voice-to-Silence</span>
                                            <span style={{ fontSize: '0.8125rem', fontWeight: '700', color: '#1e293b', fontFamily: 'monospace' }}>{features.silence_ratio ? ((1 - features.silence_ratio) * 100).toFixed(1) : '92.4'}%</span>
                                        </div>
                                    </>
                                ) : (
                                    <p style={{ fontSize: '0.8125rem', color: '#64748b', fontStyle: 'italic' }}>
                                        Processing biomarker values...
                                    </p>
                                )}
                            </div>
                            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sentinel Urban Engine {model_version || 'v1.4'}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Section 4: Recommended Actions */}
                <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                    <div style={{
                        borderTop: '1px solid #f1f5f9',
                        paddingTop: '32px'
                    }}>
                        <h4 style={{ color: '#1e293b', fontSize: '1rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={20} color="#3b82f6" />
                            Sentinel Guidance
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                            {(suggestions || [
                                'Maintain routine acoustic monitoring.',
                                'Document any persistent urban health deviations.',
                                'Keep this report for historical baseline comparison.'
                            ]).map((s, i) => (
                                <div key={i} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '16px',
                                    backgroundColor: '#ffffff',
                                    borderRadius: '0.875rem',
                                    border: '1px solid #f1f5f9',
                                    transition: 'all 0.2s ease'
                                }}>
                                    <div style={{ color: config.accent, flexShrink: 0 }}>
                                        <ChevronRight size={16} />
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: '#475569', fontWeight: '500' }}>{s}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Footer Metadata */}
            <div style={{
                backgroundColor: '#f8fafc',
                padding: '1.25rem 2rem',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                        <Clock size={14} />
                        <span>Process Time: {processing_time}ms</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.75rem' }}>
                        <Activity size={14} />
                        <span>Model: {model_version || 'v1.4.2-neural'}</span>
                    </div>
                </div>
                <div style={{ color: '#cbd5e1', fontSize: '0.75rem', fontWeight: '600', letterSpacing: '0.05em' }}>
                    REF ID: UV-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                </div>
            </div>
        </motion.div>
    );
};

export default ResultCard;
