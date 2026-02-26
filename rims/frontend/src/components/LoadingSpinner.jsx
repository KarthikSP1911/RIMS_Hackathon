import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

const LoadingSpinner = ({ message = 'Processing...' }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        "Extracting acoustic features",
        "Running neural network analysis",
        "Generating risk assessment"
    ];

    useEffect(() => {
        const timer1 = setTimeout(() => setCurrentStep(1), 800);
        const timer2 = setTimeout(() => setCurrentStep(2), 1800);
        const timer3 = setTimeout(() => setCurrentStep(3), 2800);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, []);

    return (
        <div className="loading-container" style={{ textAlign: 'center' }}>
            <div className="spinner"></div>
            <p className="loading-message" style={{ fontWeight: 600, color: '#1e293b', marginBottom: '1.5rem' }}>{message}</p>

            <div className="loading-steps-list" style={{ maxWidth: '320px', margin: '2rem auto 0', textAlign: 'left' }}>
                {steps.map((text, i) => {
                    const isDone = i < currentStep;
                    const isActive = i === currentStep;

                    return (
                        <div
                            key={i}
                            className="loading-step-item"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                marginBottom: '1rem',
                                opacity: i > currentStep ? 0.3 : 1,
                                transition: 'all 0.4s ease',
                                transform: isActive ? 'translateX(4px)' : 'none'
                            }}
                        >
                            {isDone ? (
                                <CheckCircle2 size={18} color="var(--color-primary)" />
                            ) : (
                                <Circle
                                    size={18}
                                    color={isActive ? "var(--color-primary)" : "#e2e8f0"}
                                    fill={isActive ? "var(--color-primary)" : "none"}
                                    style={{ opacity: isActive ? 0.5 : 1 }}
                                />
                            )}
                            <span style={{
                                fontSize: '0.875rem',
                                fontWeight: isActive ? 600 : 400,
                                color: isActive ? 'var(--color-primary)' : '#475569'
                            }}>
                                {text}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LoadingSpinner;
