import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

const HistoryChart = ({ historyData }) => {
    // Mock data if none provided
    const data = historyData || [
        { date: '2026-02-20', risk: 45 },
        { date: '2026-02-22', risk: 62 },
        { date: '2026-02-23', risk: 38 },
        { date: '2026-02-24', risk: 55 },
        { date: '2026-02-26', risk: 75 }, // Current assessment
    ];

    return (
        <div className="card chart-card">
            <h4 style={{ marginBottom: '1.5rem', fontWeight: '700', color: '#1e293b' }}>Urban Sentinel Health Trends</h4>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 11 }}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '0.75rem',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="risk"
                            stroke="var(--color-primary)"
                            strokeWidth={3}
                            dot={{ r: 4, fill: 'white', strokeWidth: 2 }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default HistoryChart;
