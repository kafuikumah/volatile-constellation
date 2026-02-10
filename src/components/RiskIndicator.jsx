import React from 'react';
import { getRiskColor } from '../utils/debtModel';

const RiskIndicator = ({ riskLevel }) => {
    const color = getRiskColor(riskLevel);

    const styles = {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        backgroundColor: `${color}20`, // 20% opacity
        color: color,
        fontWeight: 'bold',
        fontSize: '0.875rem',
        border: `1px solid ${color}`
    };

    const dotStyles = {
        width: '0.5rem',
        height: '0.5rem',
        borderRadius: '50%',
        backgroundColor: color
    };

    return (
        <div style={styles}>
            <span style={dotStyles}></span>
            {riskLevel} RISK
        </div>
    );
};

export default RiskIndicator;
