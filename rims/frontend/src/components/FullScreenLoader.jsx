import React, { useEffect, useState } from 'react';
import { HeartPulse } from 'lucide-react';

/**
 * Fullscreen loader displayed while the app is initializing.
 * Shows a pulsing icon to match the UrbanVoice Sentinel branding.
 */
const FullScreenLoader = () => {
    const [hidden, setHidden] = useState(false);

    // Simulate app ready after a short delay (adjust as needed)
    useEffect(() => {
        const timer = setTimeout(() => setHidden(true), 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`fullscreen-loader ${hidden ? 'hidden' : ''}`}>
            <HeartPulse size={80} className="loader-heart" color="var(--color-primary)" />
        </div>
    );
};

export default FullScreenLoader;
