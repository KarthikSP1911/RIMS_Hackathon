import React from 'react';

const RiskMeter = ({ confidence, riskLevel }) => {
    // Determine color based on risk level
    const getColor = () => {
        switch (riskLevel.toLowerCase()) {
            case 'low': return '#10b981'; // Emerald-500
            case 'moderate': return '#f59e0b'; // Amber-500
            case 'high': return '#ef4444'; // Red-500
            default: return '#3b82f6'; // Blue-500
        }
    };

    const color = getColor();
    const radius = 60;
    const stroke = 12;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (confidence / 100) * circumference;

    return (
        <div className="risk-meter-container" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg
                height={radius * 2}
                width={radius * 2}
                style={{ transform: 'rotate(-90deg)' }}
            >
                <circle
                    stroke="#f1f5f9" // bg-slate-100
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
                    style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
            </svg>
            <div className="risk-meter-content" style={{ position: 'absolute', textAlign: 'center' }}>
                <span className="risk-value" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1e293b', display: 'block' }}>{confidence}%</span>
                <span className="risk-label" style={{ fontSize: '0.625rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confidence</span>
            </div>
        </div>
    );
};

export default RiskMeter;
