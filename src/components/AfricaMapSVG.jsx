import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// African countries SVG paths (simplified accurate geometry)
const AFRICA_PATHS = {
    // North Africa
    'MA': { d: 'M180,55 L195,50 L210,55 L215,70 L200,85 L185,80 L175,65 Z', name: 'Morocco' },
    'DZ': { d: 'M215,50 L270,45 L285,65 L280,95 L250,110 L215,100 L200,70 Z', name: 'Algeria' },
    'TN': { d: 'M285,45 L295,40 L300,55 L293,70 L283,65 Z', name: 'Tunisia' },
    'LY': { d: 'M300,55 L355,50 L365,90 L340,135 L295,130 L285,95 Z', name: 'Libya' },
    'EG': { d: 'M365,55 L395,50 L400,95 L380,130 L355,125 L360,85 Z', name: 'Egypt' },

    // West Africa
    'MR': { d: 'M160,95 L200,90 L215,130 L180,155 L150,140 Z', name: 'Mauritania' },
    'ML': { d: 'M200,130 L250,125 L260,170 L220,190 L180,175 Z', name: 'Mali' },
    'NE': { d: 'M260,130 L320,135 L330,175 L280,195 L250,175 Z', name: 'Niger' },
    'TD': { d: 'M330,135 L365,130 L380,185 L340,215 L315,190 Z', name: 'Chad' },
    'SD': { d: 'M380,130 L420,135 L425,200 L385,230 L360,195 Z', name: 'Sudan' },
    'SN': { d: 'M130,175 L160,172 L165,188 L140,195 Z', name: 'Senegal' },
    'GM': { d: 'M135,185 L158,183 L158,190 L135,192 Z', name: 'Gambia' },
    'GW': { d: 'M135,200 L152,197 L155,212 L138,215 Z', name: 'Guinea-Bissau' },
    'GN': { d: 'M140,215 L175,205 L185,235 L155,245 Z', name: 'Guinea' },
    'SL': { d: 'M140,248 L160,242 L165,260 L145,265 Z', name: 'Sierra Leone' },
    'LR': { d: 'M150,268 L175,258 L185,280 L160,290 Z', name: 'Liberia' },
    'CI': { d: 'M175,250 L210,240 L225,280 L195,300 L170,285 Z', name: 'Côte d\'Ivoire' },
    'BF': { d: 'M210,200 L250,195 L255,230 L220,235 Z', name: 'Burkina Faso' },
    'GH': { d: 'M220,240 L245,235 L250,280 L225,295 Z', name: 'Ghana' },
    'TG': { d: 'M250,245 L260,243 L262,290 L252,295 Z', name: 'Togo' },
    'BJ': { d: 'M262,240 L278,238 L280,295 L264,300 Z', name: 'Benin' },
    'NG': { d: 'M280,200 L340,195 L350,265 L305,300 L275,280 Z', name: 'Nigeria' },

    // Central Africa
    'CM': { d: 'M340,265 L370,255 L385,310 L355,340 L330,315 Z', name: 'Cameroon' },
    'CF': { d: 'M360,215 L415,210 L420,260 L375,275 Z', name: 'Central African Republic' },
    'SS': { d: 'M410,230 L440,235 L445,285 L415,295 Z', name: 'South Sudan' },
    'GQ': { d: 'M330,325 L345,322 L347,338 L332,340 Z', name: 'Equatorial Guinea' },
    'GA': { d: 'M335,345 L365,340 L370,380 L340,390 Z', name: 'Gabon' },
    'CG': { d: 'M365,355 L395,350 L400,405 L370,415 Z', name: 'Congo' },
    'CD': { d: 'M370,290 L455,280 L470,390 L395,440 L350,400 Z', name: 'DR Congo' },

    // East Africa
    'ER': { d: 'M430,185 L460,175 L465,200 L435,210 Z', name: 'Eritrea' },
    'DJ': { d: 'M468,210 L480,208 L482,222 L470,225 Z', name: 'Djibouti' },
    'ET': { d: 'M430,215 L485,200 L495,270 L445,290 Z', name: 'Ethiopia' },
    'SO': { d: 'M485,215 L520,190 L530,310 L480,285 Z', name: 'Somalia' },
    'KE': { d: 'M455,290 L500,280 L510,355 L465,365 Z', name: 'Kenya' },
    'UG': { d: 'M440,295 L458,290 L462,340 L442,345 Z', name: 'Uganda' },
    'RW': { d: 'M442,350 L460,347 L462,365 L444,368 Z', name: 'Rwanda' },
    'BI': { d: 'M442,370 L460,367 L462,385 L444,388 Z', name: 'Burundi' },
    'TZ': { d: 'M450,365 L505,355 L515,450 L460,465 Z', name: 'Tanzania' },

    // Southern Africa
    'AO': { d: 'M335,400 L395,395 L400,480 L340,490 Z', name: 'Angola' },
    'ZM': { d: 'M395,415 L460,405 L470,475 L400,490 Z', name: 'Zambia' },
    'MW': { d: 'M475,430 L488,425 L492,490 L478,495 Z', name: 'Malawi' },
    'MZ': { d: 'M490,440 L525,430 L530,560 L480,575 Z', name: 'Mozambique' },
    'ZW': { d: 'M445,485 L490,480 L495,530 L450,535 Z', name: 'Zimbabwe' },
    'BW': { d: 'M400,500 L450,495 L455,560 L405,570 Z', name: 'Botswana' },
    'NA': { d: 'M340,500 L400,495 L410,610 L350,625 Z', name: 'Namibia' },
    'ZA': { d: 'M380,575 L490,565 L500,670 L395,680 L365,640 Z', name: 'South Africa' },
    'LS': { d: 'M445,625 L470,620 L475,645 L450,650 Z', name: 'Lesotho' },
    'SZ': { d: 'M485,590 L498,587 L500,605 L487,608 Z', name: 'Eswatini' },

    // Islands
    'MU': { d: 'M560,510 L568,508 L570,518 L562,520 Z', name: 'Mauritius' },
    'MG': { d: 'M535,470 L560,460 L570,560 L545,575 Z', name: 'Madagascar' },
    'SC': { d: 'M535,360 L545,358 L548,370 L538,372 Z', name: 'Seychelles' },
    'KM': { d: 'M505,435 L515,433 L517,445 L507,447 Z', name: 'Comoros' },
    'CV': { d: 'M85,195 L105,190 L110,215 L90,220 Z', name: 'Cape Verde' },
    'ST': { d: 'M305,340 L318,337 L320,355 L307,358 Z', name: 'São Tomé and Príncipe' }
};

// Risk color mapping
const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
        case 'HIGH': return '#ef4444';
        case 'MEDIUM': return '#f59e0b';
        case 'LOW': return '#22c55e';
        default: return '#d1d5db';
    }
};

const AfricaMapSVG = ({ countryRisks = {} }) => {
    const navigate = useNavigate();
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, country: '' });

    const handleClick = (code) => {
        navigate(`/country/${code}`);
    };

    const handleMouseEnter = (e, code, name) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const svgRect = e.currentTarget.closest('svg').getBoundingClientRect();
        setHoveredCountry(code);
        setTooltip({
            visible: true,
            x: rect.left - svgRect.left + rect.width / 2,
            y: rect.top - svgRect.top,
            country: name,
            risk: countryRisks[code] || 'N/A'
        });
    };

    const handleMouseLeave = () => {
        setHoveredCountry(null);
        setTooltip({ visible: false, x: 0, y: 0, country: '' });
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <svg
                viewBox="70 30 520 680"
                style={{ width: '100%', height: '100%' }}
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Ocean background */}
                <rect x="70" y="30" width="520" height="680" fill="#e8f4fc" rx="12" />

                {/* Country paths */}
                {Object.entries(AFRICA_PATHS).map(([code, { d, name }]) => {
                    const riskLevel = countryRisks[code];
                    const fillColor = getRiskColor(riskLevel);
                    const isHovered = hoveredCountry === code;

                    return (
                        <path
                            key={code}
                            d={d}
                            fill={fillColor}
                            stroke="#fff"
                            strokeWidth={isHovered ? 2 : 1}
                            style={{
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                opacity: isHovered ? 1 : 0.85,
                                filter: isHovered ? 'brightness(1.1)' : 'none',
                                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                                transformOrigin: 'center'
                            }}
                            onClick={() => handleClick(code)}
                            onMouseEnter={(e) => handleMouseEnter(e, code, name)}
                            onMouseLeave={handleMouseLeave}
                        />
                    );
                })}
            </svg>

            {/* Tooltip */}
            {tooltip.visible && (
                <div style={{
                    position: 'absolute',
                    left: tooltip.x,
                    top: tooltip.y - 45,
                    transform: 'translateX(-50%)',
                    background: 'rgba(26, 26, 46, 0.95)',
                    color: '#fff',
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    pointerEvents: 'none',
                    zIndex: 100,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ fontWeight: 600 }}>{tooltip.country}</div>
                    <div style={{
                        fontSize: 10,
                        marginTop: 2,
                        color: getRiskColor(tooltip.risk)
                    }}>
                        Risk: {tooltip.risk}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AfricaMapSVG;
