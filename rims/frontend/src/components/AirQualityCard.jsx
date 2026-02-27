import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, MapPin, RefreshCw, AlertTriangle, ChevronRight, Info, Clock, ShieldCheck } from 'lucide-react';

const locationCache = {};
const CACHE_DURATION = 5 * 60 * 1000;

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
            if (!response.ok) throw new Error(response.status === 429 ? 'Rate limit exceeded.' : 'Sync failed');
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const measurement = data.results.sort((a, b) => new Date(b.datetime?.utc) - new Date(a.datetime?.utc))[0];
                const cleanData = {
                    location: LOCATIONS.find(loc => loc.id === locationId)?.name || 'Unknown',
                    city: 'Bengaluru',
                    country: 'India',
                    value: Math.round(measurement.value * 10) / 10 || 'N/A',
                    unit: 'µg/m³',
                    lastUpdated: measurement.datetime?.utc || new Date().toISOString()
                };
                locationCache[locationId] = { data: cleanData, timestamp: Date.now() };
                setAirData(cleanData);
                if (onDataUpdate) onDataUpdate(cleanData);
            } else throw new Error('No data');
        } catch (err) { setError(err.message); } finally { setLoading(false); }
    };

    useEffect(() => { fetchAirQuality(selectedLocation); }, [selectedLocation]);

    const calculateAQI = (c) => {
        const bp = [
            { cL: 0, cH: 12.0, aL: 0, aH: 50 }, { cL: 12.1, cH: 35.4, aL: 51, aH: 100 },
            { cL: 35.5, cH: 55.4, aL: 101, aH: 150 }, { cL: 55.5, cH: 150.4, aL: 151, aH: 200 },
            { cL: 150.5, cH: 250.4, aL: 201, aH: 300 }, { cL: 250.5, cH: 500.4, aL: 301, aH: 500 }
        ];
        const b = bp.find(x => c >= x.cL && c <= x.cH);
        if (!b) return c > 500.4 ? 500 : Math.round(c);
        return Math.round(((b.aH - b.aL) / (b.cH - b.cL)) * (c - b.cL) + b.aL);
    };

    const getAQIInfo = (a) => {
        if (a <= 50) return { level: 'Good', color: '#10b981', bg: '#f0fdf4', border: '#dcfce7', status: 'Optimal' };
        if (a <= 100) return { level: 'Moderate', color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7', status: 'Fair' };
        if (a <= 150) return { level: 'Unhealthy*', color: '#f97316', bg: '#fff7ed', border: '#ffedd5', status: 'Sensitivity Risk' };
        return { level: 'High Risk', color: '#dc2626', bg: '#fef2f2', border: '#fee2e2', status: 'Exposure Alert' };
    };

    if (loading && !airData) return (
        <div className="card clinical-shadow" style={{ padding: '32px' }}>
            <div style={{ height: '18px', width: '120px', backgroundColor: '#f1f5f9', borderRadius: '4px', marginBottom: '24px' }} />
            <div style={{ height: '42px', width: '100%', backgroundColor: '#f8fafc', borderRadius: '8px', marginBottom: '16px' }} />
            <div style={{ height: '100px', width: '100%', backgroundColor: '#f8fafc', borderRadius: '12px' }} />
        </div>
    );

    const aqi = calculateAQI(airData?.value || 0);
    const info = getAQIInfo(aqi);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="card clinical-shadow"
            style={{
                padding: '0',
                overflow: 'hidden', backgroundColor: '#ffffff', border: '1px solid #f1f5f9'
            }}
        >
            <div style={{ padding: '14px 24px', backgroundColor: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Wind size={16} color="#3b82f6" />
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Environmental Sync</span>
                </div>
                <button onClick={() => fetchAirQuality(selectedLocation)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} className="breadcrumb-button">
                    <RefreshCw size={14} color="#94a3b8" />
                </button>
            </div>

            <div style={{ padding: '28px 32px 32px' }}>
                <div style={{ marginBottom: '20px', position: 'relative' }}>
                    <select
                        value={selectedLocation} onChange={(e) => setSelectedLocation(Number(e.target.value))}
                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', backgroundColor: '#ffffff', cursor: 'pointer', outline: 'none', appearance: 'none', boxSizing: 'border-box' }}
                    >
                        {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                    </select>
                    <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                        <ChevronRight size={14} color="#94a3b8" style={{ transform: 'rotate(90deg)' }} />
                    </div>
                </div>

                {error ? (
                    <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '16px', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.8125rem' }}>
                        <AlertTriangle size={16} /> {error}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ backgroundColor: '#f1f5f9', padding: '6px', borderRadius: '8px', color: '#64748b' }}><MapPin size={16} /></div>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{airData.location}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{airData.city}, India</div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: info.bg, padding: '16px 24px', borderRadius: '14px', border: `1px solid ${info.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: info.color, lineHeight: '1' }}>{aqi}</span>
                                <span style={{ fontSize: '0.625rem', fontWeight: 800, color: info.color, letterSpacing: '0.05em' }}>AQI</span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.8125rem', fontWeight: 800, color: info.color, textTransform: 'uppercase', marginBottom: '2px' }}>{info.level}</div>
                                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>{info.status}</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.65rem', fontWeight: 500 }}>
                                <Clock size={12} /> Sync: {new Date(airData.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.65rem', fontWeight: 700 }}>
                                <ShieldCheck size={12} /> EP-API SECURE
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default AirQualityCard;
