import React, { useState, useEffect } from 'react';

const RiskMeter = ({ confidence, riskLevel }) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        // Reveal value progressively after mount
        const timer = setTimeout(() => setAnimatedValue(confidence), 100);
        return () => clearTimeout(timer);
    }, [confidence]);

    const getColor = () => {
        switch (riskLevel.toLowerCase()) {
            case 'low': return '#10b981';
            case 'moderate': return '#f59e0b';
            case 'high': return '#ef4444';
            default: return '#3b82f6';
        }
    };

    const color = getColor();
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

    return (
        <div className="risk-meter-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
                height={radius * 2}
                width={radius * 2}
                style={{ transform: 'rotate(-90deg)' }}
            >
                <circle
                    stroke="#f1f5f9"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)' }}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="risk-meter-content" style={{ position: 'absolute', textAlign: 'center' }}>
                <span className="risk-value" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', display: 'block' }}>{Math.round(animatedValue)}%</span>
                <span className="risk-label" style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confidence</span>
            </div>
        </div>
    );
};

export default RiskMeter;
