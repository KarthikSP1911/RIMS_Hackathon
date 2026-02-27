import React, { useState, useEffect } from 'react';
import { Wind, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';

// Cache for air quality data per location
const locationCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Bangalore locations
const LOCATIONS = [
    { id: 5574, name: 'City Railway Station' },
    { id: 6984, name: 'Hebbal' },
    { id: 5644, name: 'Basaveshwara Nagar' },
    { id: 6983, name: 'Jayanagar' },
    { id: 5548, name: 'JP Nagar' },
    { id: 6975, name: 'Silk Board' }
];

const AirQualityCard = ({ onDataUpdate }) => {
    const [selectedLocation, setSelectedLocation] = useState(5574);
    const [airData, setAirData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAirQuality = async (locationId) => {
        // Check cache first
        const cached = locationCache[locationId];
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            setAirData(cached.data);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch(`http://localhost:8000/air-quality?location_id=${locationId}`);

            if (!response.ok) {
                if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please wait a moment.');
                }
                throw new Error('Failed to fetch air quality data');
            }
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Sort by date to get the most recent measurement
                const sortedResults = data.results.sort((a, b) => {
                    const dateA = new Date(a.datetime?.utc || 0);
                    const dateB = new Date(b.datetime?.utc || 0);
                    return dateB - dateA;
                });
                
                const measurement = sortedResults[0];
                const locationName = LOCATIONS.find(loc => loc.id === locationId)?.name || 'Unknown';
                
                const airQualityData = {
                    location: locationName,
                    city: 'Bengaluru',
                    country: 'India',
                    value: Math.round(measurement.value * 10) / 10 || 'N/A',
                    unit: 'µg/m³',
                    parameter: 'Air Quality',
                    lastUpdated: measurement.datetime?.utc || new Date().toISOString()
                };
                
                // Cache the data
                locationCache[locationId] = {
                    data: airQualityData,
                    timestamp: Date.now()
                };
                
                setAirData(airQualityData);
                
                // Pass data to parent component
                if (onDataUpdate) {
                    onDataUpdate(airQualityData);
                }
            } else {
                throw new Error('No air quality data available');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAirQuality(selectedLocation);
    }, [selectedLocation]);

    const handleLocationChange = (e) => {
        setSelectedLocation(Number(e.target.value));
    };

    const getAQILevel = (value) => {
        if (value <= 12) return { level: 'Good', color: '#10b981', bg: '#d1fae5' };
        if (value <= 35.4) return { level: 'Moderate', color: '#f59e0b', bg: '#fef3c7' };
        if (value <= 55.4) return { level: 'Unhealthy for Sensitive', color: '#f97316', bg: '#fed7aa' };
        if (value <= 150.4) return { level: 'Unhealthy', color: '#ef4444', bg: '#fecaca' };
        return { level: 'Hazardous', color: '#991b1b', bg: '#fca5a5' };
    };

    // Convert PM2.5/PM10 µg/m³ to AQI (US EPA standard)
    const calculateAQI = (concentration) => {
        // PM2.5 breakpoints (µg/m³) to AQI
        const breakpoints = [
            { cLow: 0, cHigh: 12.0, aqiLow: 0, aqiHigh: 50 },
            { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
            { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
            { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
            { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
            { cLow: 250.5, cHigh: 500.4, aqiLow: 301, aqiHigh: 500 }
        ];

        for (let bp of breakpoints) {
            if (concentration >= bp.cLow && concentration <= bp.cHigh) {
                const aqi = ((bp.aqiHigh - bp.aqiLow) / (bp.cHigh - bp.cLow)) * 
                           (concentration - bp.cLow) + bp.aqiLow;
                return Math.round(aqi);
            }
        }
        
        // If concentration is above 500.4, return 500+
        return concentration > 500.4 ? 500 : Math.round(concentration);
    };

    const getAQIInfo = (aqi) => {
        if (aqi <= 50) return { level: 'Good', color: '#10b981', bg: '#d1fae5' };
        if (aqi <= 100) return { level: 'Moderate', color: '#f59e0b', bg: '#fef3c7' };
        if (aqi <= 150) return { level: 'Unhealthy for Sensitive', color: '#f97316', bg: '#fed7aa' };
        if (aqi <= 200) return { level: 'Unhealthy', color: '#ef4444', bg: '#fecaca' };
        if (aqi <= 300) return { level: 'Very Unhealthy', color: '#991b1b', bg: '#fca5a5' };
        return { level: 'Hazardous', color: '#7f1d1d', bg: '#fca5a5' };
    };

    if (loading) {
        return (
            <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Wind size={20} color="#3b82f6" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Real-Time Air Quality</h3>
                </div>
                <select 
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        borderRadius: '0.5rem',
                        border: '2px solid #e2e8f0',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#1e293b',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem'
                    }}
                >
                    {LOCATIONS.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                </select>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <AlertTriangle size={20} color="#ef4444" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Air Quality Data</h3>
                </div>
                <select 
                    value={selectedLocation}
                    onChange={handleLocationChange}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        borderRadius: '0.5rem',
                        border: '2px solid #e2e8f0',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: '#1e293b',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer',
                        outline: 'none',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem'
                    }}
                >
                    {LOCATIONS.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                </select>
                <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>
            </div>
        );
    }

    if (!airData) return null;

    const aqi = calculateAQI(airData.value);
    const aqiInfo = getAQIInfo(aqi);

    return (
        <div className="card" style={{ padding: '1.5rem', border: `2px solid ${aqiInfo.color}20` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Wind size={20} color="#3b82f6" />
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Real-Time Air Quality</h3>
                </div>
                <button 
                    onClick={() => fetchAirQuality(selectedLocation)}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    title="Refresh"
                >
                    <RefreshCw size={16} color="#64748b" />
                </button>
            </div>

            <select 
                value={selectedLocation}
                onChange={handleLocationChange}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    marginBottom: '1rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #e2e8f0',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: '#1e293b',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    paddingRight: '2.5rem'
                }}
                onMouseOver={(e) => e.target.style.borderColor = '#3b82f6'}
                onMouseOut={(e) => e.target.style.borderColor = '#e2e8f0'}
                onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
            >
                {LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <MapPin size={14} color="#64748b" />
                <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {airData.city}, {airData.country}
                </span>
            </div>

            <div style={{ 
                backgroundColor: aqiInfo.bg, 
                padding: '1rem', 
                borderRadius: '0.5rem',
                marginBottom: '0.75rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 700, color: aqiInfo.color }}>
                        {aqi}
                    </span>
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>AQI</span>
                </div>
                <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: 600, 
                    color: aqiInfo.color,
                    marginTop: '0.25rem'
                }}>
                    {aqiInfo.level}
                </div>
            </div>

            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Raw: {airData.value} {airData.unit} • Updated: {new Date(airData.lastUpdated).toLocaleString()}
            </p>
        </div>
    );
};

export default AirQualityCard;
