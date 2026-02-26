import React from 'react';

const Skeleton = ({ className = '', style = {} }) => (
    <div className={`skeleton ${className}`} style={style} />
);

export const SkeletonCircle = ({ size = 48, className = '' }) => (
    <Skeleton
        className={`skeleton-circle ${className}`}
        style={{ width: size, height: size, flexShrink: 0 }}
    />
);

export const SkeletonText = ({ lines = 1, className = '', height = '1rem' }) => (
    <div className={`skeleton-text-container ${className}`} style={{ width: '100%' }}>
        {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
                key={i}
                style={{
                    height,
                    width: i === lines - 1 && lines > 1 ? '60%' : '100%',
                    marginBottom: i === lines - 1 ? 0 : '0.5rem'
                }}
            />
        ))}
    </div>
);

export default Skeleton;
