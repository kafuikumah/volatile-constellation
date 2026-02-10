import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Tooltip as MapTooltip } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { getRiskColor, getCountryOverallRisk } from '../utils/debtModel';
import { fetchCountryDebtData } from '../services/worldBankApi';
import { AU_MEMBER_STATES } from '../utils/countries';

const MapVisualization = () => {
    const navigate = useNavigate();
    const [geoData, setGeoData] = useState(null);
    const [countryRiskData, setCountryRiskData] = useState({});

    useEffect(() => {
        // Fetch GeoJSON for Africa
        fetch('https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/africa.geojson')
            .then(res => res.json())
            .then(data => setGeoData(data));

        // Fetch risk data for all countries to color the map
        const loadRiskData = async () => {
            const risks = {};
            const promises = AU_MEMBER_STATES.map(async (c) => {
                try {
                    const data = await fetchCountryDebtData(c.code);
                    risks[c.name] = getCountryOverallRisk(data);
                    risks[c.code] = getCountryOverallRisk(data);
                } catch (e) {
                    console.error('Failed to load risk for map', c.name);
                }
            });
            await Promise.all(promises);
            setCountryRiskData(risks);
        };

        loadRiskData();
    }, []);

    const style = (feature) => {
        const countryName = feature.properties.name;
        let risk = 'UNKNOWN';
        if (countryRiskData[countryName]) {
            risk = countryRiskData[countryName];
        } else {
            const found = AU_MEMBER_STATES.find(s => s.name === countryName || s.name.includes(countryName) || countryName.includes(s.name));
            if (found && countryRiskData[found.code]) {
                risk = countryRiskData[found.code];
            }
        }

        return {
            fillColor: getRiskColor(risk),
            weight: 1,
            opacity: 1,
            color: 'white',
            fillOpacity: 0.7
        };
    };

    const onEachFeature = (feature, layer) => {
        const countryName = feature.properties.name;

        // Find matching AU member state
        const country = AU_MEMBER_STATES.find(s =>
            s.name === countryName ||
            s.name.includes(countryName) ||
            countryName.includes(s.name)
        );

        // Add click handler
        layer.on('click', () => {
            if (country) {
                navigate(`/country/${country.code}`);
            }
        });

        // Add hover effect
        layer.on('mouseover', () => {
            layer.setStyle({
                weight: 3,
                fillOpacity: 0.9
            });
        });

        layer.on('mouseout', () => {
            layer.setStyle({
                weight: 1,
                fillOpacity: 0.7
            });
        });

        // Bind tooltip
        if (country) {
            layer.bindTooltip(country.name, { sticky: true });
        }
    };

    if (!geoData) return <div>Loading Map...</div>;

    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid #334155' }}>
            <MapContainer center={[0, 20]} zoom={3} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <GeoJSON data={geoData} style={style} onEachFeature={onEachFeature} />
            </MapContainer>
        </div>
    );
};

export default MapVisualization;
