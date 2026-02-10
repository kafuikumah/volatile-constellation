import React, { useState, useEffect } from 'react';
import { Download, FileText, Table, Printer, CheckCircle, Loader } from 'lucide-react';
import { AU_MEMBER_STATES } from '../utils/countries';
import { fetchCountryDebtData } from '../services/worldBankApi';
import { getCountryOverallRisk } from '../utils/debtModel';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';

const ExportTools = () => {
    const [selectedFormat, setSelectedFormat] = useState('pdf');
    const [selectedCountries, setSelectedCountries] = useState(['NGA', 'KEN', 'GHA']);
    const [includeCharts, setIncludeCharts] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [countryData, setCountryData] = useState({});
    const [loadingData, setLoadingData] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const formats = [
        { id: 'pdf', label: 'PDF Report', icon: FileText, desc: 'Executive summary with data tables' },
        { id: 'csv', label: 'CSV Data', icon: Table, desc: 'Raw data for analysis' },
        { id: 'xlsx', label: 'Excel', icon: Table, desc: 'Formatted spreadsheet with multiple sheets' }
    ];

    // Fetch data for selected countries
    useEffect(() => {
        const fetchData = async () => {
            setLoadingData(true);
            const data = {};
            for (const code of selectedCountries) {
                if (!countryData[code]) {
                    const result = await fetchCountryDebtData(code);
                    data[code] = result;
                }
            }
            setCountryData(prev => ({ ...prev, ...data }));
            setLoadingData(false);
        };

        if (selectedCountries.length > 0) {
            fetchData();
        }
    }, [selectedCountries]);

    const getCountryName = (code) => {
        return AU_MEMBER_STATES.find(c => c.code === code)?.name || code;
    };

    const formatPercent = (val) => {
        if (!val && val !== 0) return 'N/A';
        return `${val.toFixed(1)}%`;
    };

    const handleExport = async () => {
        setIsExporting(true);
        setExportSuccess(false);

        try {
            // Prepare data for export
            const exportData = selectedCountries.map(code => {
                const data = countryData[code] || {};
                const country = AU_MEMBER_STATES.find(c => c.code === code);
                return {
                    code,
                    name: country?.name || code,
                    region: country?.region || 'N/A',
                    debtToGDP: data.EXTERNAL_DEBT_GNI_PCT || null,
                    debtToExports: data.EXTERNAL_DEBT_EXPORTS_PCT || null,
                    debtServiceExports: data.DEBT_SERVICE_EXPORTS_PCT || null,
                    debtServiceRevenue: data.DEBT_SERVICE_REVENUE_PCT || null,
                    totalDebt: data.EXTERNAL_DEBT_STOCKS || null,
                    shortTermDebt: data.SHORT_TERM_DEBT || null,
                    multilateralDebt: data.MULTILATERAL_DEBT || null,
                    riskLevel: getCountryOverallRisk(data)
                };
            });

            if (selectedFormat === 'pdf') {
                await generatePDF(exportData);
            } else if (selectedFormat === 'xlsx') {
                await generateExcel(exportData);
            } else {
                await generateCSV(exportData);
            }

            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);
        } catch (error) {
            console.error('Export error:', error);
            alert('Export failed. Please try again.');
        }

        setIsExporting(false);
    };

    const generatePDF = async (data) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header
        doc.setFillColor(0, 34, 68);
        doc.rect(0, 0, pageWidth, 35, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('African Debt Monitoring Mechanism', pageWidth / 2, 15, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Debt Analysis Report', pageWidth / 2, 25, { align: 'center' });

        // Report info
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(10);
        doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`, 14, 45);
        doc.text(`Countries: ${data.length}`, 14, 52);

        // Summary Statistics
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Executive Summary', 14, 65);

        const highRisk = data.filter(d => d.riskLevel === 'HIGH').length;
        const moderateRisk = data.filter(d => d.riskLevel === 'MODERATE').length;
        const lowRisk = data.filter(d => d.riskLevel === 'LOW').length;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`• High Risk Countries: ${highRisk}`, 14, 75);
        doc.text(`• Moderate Risk Countries: ${moderateRisk}`, 14, 82);
        doc.text(`• Low Risk Countries: ${lowRisk}`, 14, 89);

        // Main data table
        const tableData = data.map(d => [
            d.name,
            d.riskLevel,
            formatPercent(d.debtToGDP),
            formatPercent(d.debtToExports),
            formatPercent(d.debtServiceExports),
            formatPercent(d.debtServiceRevenue)
        ]);

        autoTable(doc, {
            startY: 100,
            head: [['Country', 'Risk', 'Debt/GDP', 'Debt/Exports', 'Svc/Exports', 'Svc/Revenue']],
            body: tableData,
            theme: 'striped',
            headStyles: {
                fillColor: [0, 34, 68],
                fontSize: 9,
                fontStyle: 'bold'
            },
            bodyStyles: {
                fontSize: 8
            },
            columnStyles: {
                0: { cellWidth: 45 },
                1: { cellWidth: 25 },
                2: { cellWidth: 25 },
                3: { cellWidth: 28 },
                4: { cellWidth: 25 },
                5: { cellWidth: 28 }
            },
            didParseCell: (data) => {
                if (data.column.index === 1 && data.section === 'body') {
                    const risk = data.cell.raw;
                    if (risk === 'HIGH') {
                        data.cell.styles.textColor = [239, 68, 68];
                        data.cell.styles.fontStyle = 'bold';
                    } else if (risk === 'MODERATE') {
                        data.cell.styles.textColor = [245, 158, 11];
                    } else {
                        data.cell.styles.textColor = [34, 197, 94];
                    }
                }
            }
        });

        // Footer
        const pageCount = doc.internal.pages.length - 1;
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `Page ${i} of ${pageCount} | African Union - Credit Assessment & Analysis Program`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Save
        doc.save(`AU_Debt_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    };

    const generateExcel = async (data) => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'African Debt Monitoring Mechanism';
        workbook.created = new Date();

        // Summary Sheet
        const summarySheet = workbook.addWorksheet('Summary');
        summarySheet.columns = [
            { header: 'Country', key: 'name', width: 30 },
            { header: 'Code', key: 'code', width: 10 },
            { header: 'Risk Level', key: 'riskLevel', width: 15 },
            { header: 'Debt/GDP (%)', key: 'debtToGDP', width: 15 },
            { header: 'Debt/Exports (%)', key: 'debtToExports', width: 18 },
            { header: 'Svc/Exports (%)', key: 'debtServiceExports', width: 15 },
            { header: 'Svc/Revenue (%)', key: 'debtServiceRevenue', width: 18 }
        ];

        // Header styling
        summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002244' } };

        // Add data
        data.forEach(d => {
            const row = summarySheet.addRow({
                name: d.name,
                code: d.code,
                riskLevel: d.riskLevel,
                debtToGDP: d.debtToGDP,
                debtToExports: d.debtToExports,
                debtServiceExports: d.debtServiceExports,
                debtServiceRevenue: d.debtServiceRevenue
            });

            // Color-code risk level
            const riskCell = row.getCell('riskLevel');
            if (d.riskLevel === 'HIGH') {
                riskCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF2F2' } };
                riskCell.font = { color: { argb: 'FFEF4444' }, bold: true };
            } else if (d.riskLevel === 'MODERATE') {
                riskCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFBEB' } };
                riskCell.font = { color: { argb: 'FFF59E0B' } };
            } else {
                riskCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF0FDF4' } };
                riskCell.font = { color: { argb: 'FF22C55E' } };
            }
        });

        // Detailed Data Sheet
        const detailSheet = workbook.addWorksheet('Detailed Data');
        detailSheet.columns = [
            { header: 'Country', key: 'name', width: 30 },
            { header: 'Total External Debt (USD)', key: 'totalDebt', width: 25 },
            { header: 'Short-term Debt (USD)', key: 'shortTermDebt', width: 22 },
            { header: 'Multilateral Debt (USD)', key: 'multilateralDebt', width: 22 },
            { header: 'Region', key: 'region', width: 20 }
        ];

        detailSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        detailSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF002244' } };

        data.forEach(d => {
            detailSheet.addRow({
                name: d.name,
                totalDebt: d.totalDebt,
                shortTermDebt: d.shortTermDebt,
                multilateralDebt: d.multilateralDebt,
                region: d.region
            });
        });

        // Generate and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AU_Debt_Data_${new Date().toISOString().slice(0, 10)}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const generateCSV = async (data) => {
        const headers = [
            'Country',
            'Country Code',
            'Region',
            'Risk Level',
            'Debt-to-GDP (%)',
            'Debt-to-Exports (%)',
            'Debt Service/Exports (%)',
            'Debt Service/Revenue (%)',
            'Total External Debt (USD)',
            'Short-term Debt (USD)',
            'Multilateral Debt (USD)'
        ];

        const rows = data.map(d => [
            d.name,
            d.code,
            d.region,
            d.riskLevel,
            d.debtToGDP?.toFixed(1) || 'N/A',
            d.debtToExports?.toFixed(1) || 'N/A',
            d.debtServiceExports?.toFixed(1) || 'N/A',
            d.debtServiceRevenue?.toFixed(1) || 'N/A',
            d.totalDebt?.toFixed(0) || 'N/A',
            d.shortTermDebt?.toFixed(0) || 'N/A',
            d.multilateralDebt?.toFixed(0) || 'N/A'
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AU_Debt_Data_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const toggleCountry = (code) => {
        setSelectedCountries(prev =>
            prev.includes(code)
                ? prev.filter(c => c !== code)
                : [...prev, code]
        );
    };

    return (
        <div style={{ padding: '0 0 2rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <Download size={24} color="var(--color-accent)" />
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Export & Reports</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                {/* Export Options */}
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600 }}>Export Format</h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                        {formats.map(f => (
                            <div
                                key={f.id}
                                onClick={() => setSelectedFormat(f.id)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: 16,
                                    borderRadius: 12,
                                    border: selectedFormat === f.id ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                                    background: selectedFormat === f.id ? 'var(--color-accent)08' : 'white',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <f.icon size={20} color={selectedFormat === f.id ? 'var(--color-accent)' : '#888'} />
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e' }}>{f.label}</div>
                                    <div style={{ fontSize: 11, color: '#888' }}>{f.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {selectedFormat === 'pdf' && (
                        <div style={{ marginBottom: 20 }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                fontSize: 13,
                                cursor: 'pointer'
                            }}>
                                <input
                                    type="checkbox"
                                    checked={includeCharts}
                                    onChange={(e) => setIncludeCharts(e.target.checked)}
                                    style={{ width: 16, height: 16, accentColor: 'var(--color-accent)' }}
                                />
                                Include summary statistics
                            </label>
                        </div>
                    )}

                    {/* Data Loading Status */}
                    {loadingData && selectedCountries.length > 0 && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: 12,
                            background: '#fef3c7',
                            borderRadius: 8,
                            marginBottom: 16,
                            fontSize: 12,
                            color: '#92400e'
                        }}>
                            <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} />
                            Loading country data...
                        </div>
                    )}

                    {/* Export Success */}
                    {exportSuccess && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: 12,
                            background: '#dcfce7',
                            borderRadius: 8,
                            marginBottom: 16,
                            fontSize: 12,
                            color: '#166534'
                        }}>
                            <CheckCircle size={14} />
                            Export completed successfully!
                        </div>
                    )}

                    <button
                        onClick={handleExport}
                        disabled={isExporting || selectedCountries.length === 0 || loadingData}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            padding: '14px 20px',
                            borderRadius: 12,
                            border: 'none',
                            background: 'var(--color-accent)',
                            color: 'white',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: isExporting || selectedCountries.length === 0 ? 'not-allowed' : 'pointer',
                            opacity: isExporting || selectedCountries.length === 0 || loadingData ? 0.6 : 1
                        }}
                    >
                        {isExporting ? (
                            <>
                                <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Download size={16} />
                                Export {selectedFormat.toUpperCase()}
                            </>
                        )}
                    </button>
                </div>

                {/* Country Selection */}
                <div style={{
                    background: 'rgba(255,255,255,0.8)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: 20,
                    padding: 24,
                    border: '1px solid rgba(255,255,255,0.9)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                            Select Countries ({selectedCountries.length})
                        </h3>
                        <button
                            onClick={() => setSelectedCountries(selectedCountries.length === AU_MEMBER_STATES.length ? [] : AU_MEMBER_STATES.map(c => c.code))}
                            style={{
                                padding: '4px 12px',
                                fontSize: 11,
                                borderRadius: 6,
                                border: '1px solid var(--color-border)',
                                background: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            {selectedCountries.length === AU_MEMBER_STATES.length ? 'Clear All' : 'Select All'}
                        </button>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 8,
                        maxHeight: 300,
                        overflowY: 'auto',
                        padding: 4
                    }}>
                        {AU_MEMBER_STATES.map(country => (
                            <button
                                key={country.code}
                                onClick={() => toggleCountry(country.code)}
                                style={{
                                    padding: '6px 12px',
                                    fontSize: 12,
                                    borderRadius: 16,
                                    border: selectedCountries.includes(country.code)
                                        ? '1px solid var(--color-accent)'
                                        : '1px solid var(--color-border)',
                                    background: selectedCountries.includes(country.code)
                                        ? 'var(--color-accent)'
                                        : 'white',
                                    color: selectedCountries.includes(country.code) ? 'white' : '#555',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s'
                                }}
                            >
                                {country.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Report Templates */}
            <div style={{
                marginTop: 24,
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                borderRadius: 20,
                padding: 24,
                border: '1px solid rgba(255,255,255,0.9)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
            }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 14, fontWeight: 600 }}>Report Templates</h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                    {[
                        { name: 'Executive Summary', desc: 'High-level overview for cabinet briefings', icon: Printer },
                        { name: 'Full Country Profile', desc: 'Detailed analysis with all indicators', icon: FileText },
                        { name: 'Comparative Analysis', desc: 'Side-by-side country comparison', icon: Table }
                    ].map((template, i) => (
                        <div key={i} style={{
                            padding: 16,
                            borderRadius: 12,
                            border: '1px solid var(--color-border)',
                            background: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                            onClick={() => {
                                if (i === 0) {
                                    setSelectedFormat('pdf');
                                    setIncludeCharts(true);
                                } else if (i === 1) {
                                    setSelectedFormat('xlsx');
                                } else {
                                    setSelectedFormat('csv');
                                }
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-bg-secondary)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                        >
                            <template.icon size={24} color="var(--color-accent)" style={{ marginBottom: 8 }} />
                            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{template.name}</div>
                            <div style={{ fontSize: 11, color: '#888' }}>{template.desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ExportTools;
