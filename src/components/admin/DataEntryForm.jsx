import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Upload, FileSpreadsheet, Save, Send, AlertCircle, CheckCircle,
    DollarSign, Percent, TrendingUp, Building, ChevronDown, X, Download,
    Globe, Calendar, CreditCard, PiggyBank, Users, Landmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useIsMobile } from '../../hooks/useMediaQuery';
import ExcelJS from 'exceljs';

const SUBMISSIONS_KEY = 'dmo_portal_submissions';

// Get submissions from localStorage
const getSubmissions = () => {
    const stored = localStorage.getItem(SUBMISSIONS_KEY);
    return stored ? JSON.parse(stored) : [];
};

// Save submission to localStorage
const saveSubmission = (submission) => {
    const submissions = getSubmissions();
    submissions.push(submission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
};

/**
 * Data Entry Form aligned with:
 * - UNCTAD DMFAS (Debt Management and Financial Analysis System)
 * - IMF/World Bank Debt Sustainability Framework (DSF)
 * - World Bank QEDS (Quarterly External Debt Statistics) Template
 */
const DataEntryForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Form structure aligned with international standards
    const [formData, setFormData] = useState({
        // ===== METADATA =====
        reportingPeriod: '',
        reportingYear: new Date().getFullYear(),
        reportingCurrency: 'USD',
        reportingScale: 'millions', // millions or thousands
        dataAsOf: '',

        // ===== TABLE 1: GROSS EXTERNAL DEBT POSITION BY SECTOR =====
        // General Government
        gg_shortTerm: '',
        gg_longTerm: '',
        // Central Bank
        cb_shortTerm: '',
        cb_longTerm: '',
        // Deposit-Taking Corporations (Banks)
        dtc_shortTerm: '',
        dtc_longTerm: '',
        // Other Sectors (Non-financial corporations, Households)
        os_shortTerm: '',
        os_longTerm: '',
        // Direct Investment: Intercompany Lending
        di_debtLiabilities: '',

        // ===== TABLE 2: EXTERNAL DEBT BY CREDITOR TYPE =====
        // Multilateral Creditors
        ext_multilateral_wb: '',      // World Bank (IBRD + IDA)
        ext_multilateral_imf: '',     // IMF
        ext_multilateral_afdb: '',    // African Development Bank
        ext_multilateral_other: '',   // Other Multilateral
        // Bilateral Creditors
        ext_bilateral_parisClub: '',  // Paris Club
        ext_bilateral_china: '',      // China
        ext_bilateral_other: '',      // Other Bilateral
        // Commercial Creditors
        ext_commercial_bonds: '',     // Eurobonds / International Bonds
        ext_commercial_banks: '',     // Commercial Banks
        ext_commercial_other: '',     // Other Commercial

        // ===== TABLE 3: EXTERNAL DEBT BY INSTRUMENT =====
        inst_debtSecurities: '',      // Debt Securities (Bonds, Notes)
        inst_loans: '',               // Loans
        inst_tradeCredits: '',        // Trade Credits and Advances
        inst_currencyDeposits: '',    // Currency and Deposits
        inst_sdrAllocations: '',      // SDR Allocations
        inst_otherDebtLiabilities: '',// Other Debt Liabilities

        // ===== TABLE 4: DOMESTIC DEBT =====
        dom_tbills: '',               // Treasury Bills (<1 year)
        dom_tbonds: '',               // Treasury Bonds (>1 year)
        dom_cbAdvances: '',           // Central Bank Advances
        dom_commercialLoans: '',      // Domestic Commercial Bank Loans
        dom_suppliersCredits: '',     // Suppliers' Credits
        dom_arrears: '',              // Domestic Arrears
        dom_other: '',                // Other Domestic Debt

        // ===== TABLE 5: DEBT SERVICE =====
        ds_principalExternal: '',     // Principal Payments - External
        ds_interestExternal: '',      // Interest Payments - External
        ds_principalDomestic: '',     // Principal Payments - Domestic
        ds_interestDomestic: '',      // Interest Payments - Domestic

        // ===== TABLE 6: KEY RATIOS / INDICATORS =====
        ratio_debtToGdp: '',          // Total Public Debt / GDP (%)
        ratio_externalDebtToGdp: '',  // External Debt / GDP (%)
        ratio_debtServiceToExports: '',// Debt Service / Exports (%)
        ratio_debtServiceToRevenue: '',// Debt Service / Government Revenue (%)
        ratio_interestToRevenue: '',  // Interest / Government Revenue (%)
        ratio_externalDebtToExports: '',// External Debt / Exports (%)

        // ===== TABLE 7: MACROECONOMIC CONTEXT =====
        macro_gdpNominal: '',         // Nominal GDP (current prices)
        macro_gdpReal: '',            // Real GDP Growth Rate (%)
        macro_exports: '',            // Exports of Goods and Services
        macro_imports: '',            // Imports of Goods and Services
        macro_govRevenue: '',         // Government Revenue
        macro_govExpenditure: '',     // Government Expenditure
        macro_primaryBalance: '',     // Primary Fiscal Balance
        macro_exchangeRate: '',       // Exchange Rate (LCU/USD, period average)
        macro_inflation: '',          // Inflation Rate (%)
        macro_reserves: '',           // International Reserves

        // ===== CONTINGENT LIABILITIES =====
        cont_guarantees: '',          // Government Guarantees
        cont_pppLiabilities: '',      // PPP-related Liabilities
        cont_soeDebt: '',             // State-Owned Enterprise Debt
        cont_other: '',               // Other Contingent Liabilities

        // ===== NOTES =====
        notes: '',
        dataSource: '',
        methodology: ''
    });

    const [uploadedFile, setUploadedFile] = useState(null);
    const [parseError, setParseError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeSection, setActiveSection] = useState('external');
    const [parsedFields, setParsedFields] = useState(0);
    const isMobile = useIsMobile();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setParseError('');
        setSuccess('');
        setUploadedFile(file);
        setParsedFields(0);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const workbook = new ExcelJS.Workbook();
            let parsedData = {};

            if (file.name.endsWith('.csv')) {
                const text = new TextDecoder().decode(arrayBuffer);
                const lines = text.split('\n').filter(l => l.trim());

                if (lines.length >= 2) {
                    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
                    const values = lines[1].split(',').map(v => v.trim().replace(/"/g, ''));
                    headers.forEach((h, i) => {
                        if (h && values[i]) parsedData[h] = values[i];
                    });
                }
            } else {
                await workbook.xlsx.load(arrayBuffer);

                let worksheet = workbook.getWorksheet('Data Entry') || workbook.getWorksheet('Data') || workbook.worksheets[0];

                if (!worksheet) {
                    setParseError('Could not find a valid worksheet in the file.');
                    return;
                }

                console.log('Parsing worksheet:', worksheet.name, 'Rows:', worksheet.rowCount);

                // Strategy 1: Vertical layout (Category | Variable | Value)
                let valueColIndex = -1;
                let variableColIndex = -1;
                let categoryColIndex = -1;

                const headerRow = worksheet.getRow(1);
                headerRow.eachCell((cell, colNumber) => {
                    const val = cell.value?.toString()?.toLowerCase() || '';
                    if (val.includes('value')) valueColIndex = colNumber;
                    if (val.includes('variable')) variableColIndex = colNumber;
                    if (val.includes('category')) categoryColIndex = colNumber;
                });

                if (valueColIndex > 0 && variableColIndex > 0) {
                    console.log('Detected vertical format. Value col:', valueColIndex);

                    worksheet.eachRow((row, rowNumber) => {
                        if (rowNumber === 1) return;

                        const category = categoryColIndex > 0 ? row.getCell(categoryColIndex).value?.toString()?.trim() || '' : '';
                        const variable = row.getCell(variableColIndex).value?.toString()?.trim() || '';
                        const value = row.getCell(valueColIndex).value;

                        if (variable && value !== null && value !== undefined && value !== '') {
                            const key = category ? `${category}| ${variable} ` : variable;
                            parsedData[key] = value.toString();
                            parsedData[variable] = value.toString();
                        }
                    });
                } else {
                    console.log('Using horizontal format');

                    const headers = [];
                    headerRow.eachCell((cell, colNumber) => {
                        headers[colNumber] = cell.value?.toString()?.trim() || '';
                    });

                    const dataRow = worksheet.getRow(2);
                    dataRow.eachCell((cell, colNumber) => {
                        const header = headers[colNumber];
                        if (header && cell.value !== null && cell.value !== undefined) {
                            parsedData[header] = cell.value.toString();
                        }
                    });
                }
            }

            console.log('Parsed data keys:', Object.keys(parsedData));

            const fieldsCount = mapDataToForm(parsedData);
            setParsedFields(fieldsCount);

            if (fieldsCount > 0) {
                setSuccess(`File parsed successfully! ${fieldsCount} fields populated.`);
            } else {
                setParseError('File was read but no matching fields found. Use Download QEDS Template for correct format.');
            }
        } catch (err) {
            setParseError(`Error parsing file: ${err.message} `);
            console.error('Parse error:', err);
        }
    };

    const findValue = (data, ...possibleNames) => {
        for (const name of possibleNames) {
            if (data[name] !== undefined && data[name] !== '') return data[name];
            const lowerName = name.toLowerCase();
            for (const key of Object.keys(data)) {
                if (key.toLowerCase() === lowerName) return data[key];
                if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
                    return data[key];
                }
            }
        }
        return '';
    };

    const mapDataToForm = (data) => {
        let fieldsPopulated = 0;

        const mappings = {
            gg_longTerm: ['General Government|Long-term', 'Long-term', 'GG_LT', 'General Government Long-term'],
            gg_shortTerm: ['General Government|Short-term', 'Short-term', 'GG_ST', 'General Government Short-term'],
            cb_longTerm: ['Central Bank|Long-term', 'CB_LT', 'Central Bank Long-term'],
            cb_shortTerm: ['Central Bank|Short-term', 'CB_ST', 'Central Bank Short-term'],
            dtc_longTerm: ['Deposit-Taking Corporations|Long-term', 'DTC_LT', 'Banks Long-term'],
            dtc_shortTerm: ['Deposit-Taking Corporations|Short-term', 'DTC_ST', 'Banks Short-term'],
            ext_multilateral_wb: ['Multilateral|World Bank (IBRD + IDA)', 'World Bank', 'IBRD_IDA', 'WB'],
            ext_multilateral_imf: ['Multilateral|IMF', 'IMF'],
            ext_multilateral_afdb: ['Multilateral|African Development Bank', 'AfDB', 'African Development Bank'],
            ext_bilateral_parisClub: ['Bilateral|Paris Club', 'Paris Club'],
            ext_bilateral_china: ['Bilateral|China', 'China'],
            ext_commercial_bonds: ['Commercial|Bonds/Eurobonds', 'Bonds', 'Eurobonds'],
            ext_commercial_banks: ['Commercial|Commercial Banks', 'Commercial Banks'],
            inst_debtSecurities: ['Instruments|Debt Securities', 'Debt Securities'],
            inst_loans: ['Instruments|Loans', 'Loans'],
            inst_tradeCredits: ['Instruments|Trade Credits', 'Trade Credits'],
            dom_tbills: ['Domestic|Treasury Bills (<1 year)', 'Treasury Bills', 'T-Bills'],
            dom_tbonds: ['Domestic|Treasury Bonds (>1 year)', 'Treasury Bonds', 'T-Bonds'],
            ds_principalExternal: ['External|Principal Payments', 'External Principal'],
            ds_interestExternal: ['External|Interest Payments', 'External Interest'],
            ds_principalDomestic: ['Domestic|Principal Payments', 'Domestic Principal'],
            ds_interestDomestic: ['Domestic|Interest Payments', 'Domestic Interest'],
            ratio_debtToGdp: ['Sustainability|Total Debt / GDP', 'Debt/GDP', 'Debt to GDP'],
            ratio_debtServiceToExports: ['Sustainability|Debt Service / Exports', 'DS/Exports'],
            ratio_debtServiceToRevenue: ['Sustainability|Debt Service / Revenue', 'DS/Revenue'],
            macro_gdpNominal: ['Macro|Nominal GDP', 'Nominal GDP', 'GDP'],
            macro_exports: ['Macro|Exports of Goods & Services', 'Exports'],
            macro_govRevenue: ['Macro|Government Revenue', 'Revenue'],
            macro_exchangeRate: ['Macro|Exchange Rate (LCU/USD)', 'Exchange Rate', 'FX Rate']
        };

        const updates = {};
        for (const [field, possibleNames] of Object.entries(mappings)) {
            const value = findValue(data, ...possibleNames);
            if (value) {
                updates[field] = value;
                fieldsPopulated++;
            }
        }

        if (Object.keys(updates).length > 0) {
            setFormData(prev => ({ ...prev, ...updates }));
        }

        return fieldsPopulated;
    };

    const handleSubmit = async (status = 'pending') => {
        setLoading(true);
        setSuccess('');

        try {
            // Calculate totals
            const totalExternalDebt =
                (parseFloat(formData.gg_shortTerm) || 0) +
                (parseFloat(formData.gg_longTerm) || 0) +
                (parseFloat(formData.cb_shortTerm) || 0) +
                (parseFloat(formData.cb_longTerm) || 0) +
                (parseFloat(formData.dtc_shortTerm) || 0) +
                (parseFloat(formData.dtc_longTerm) || 0) +
                (parseFloat(formData.os_shortTerm) || 0) +
                (parseFloat(formData.os_longTerm) || 0) +
                (parseFloat(formData.di_debtLiabilities) || 0);

            const totalDomesticDebt =
                (parseFloat(formData.dom_tbills) || 0) +
                (parseFloat(formData.dom_tbonds) || 0) +
                (parseFloat(formData.dom_cbAdvances) || 0) +
                (parseFloat(formData.dom_commercialLoans) || 0) +
                (parseFloat(formData.dom_suppliersCredits) || 0) +
                (parseFloat(formData.dom_arrears) || 0) +
                (parseFloat(formData.dom_other) || 0);

            const submission = {
                id: `sub - ${Date.now()} `,
                countryCode: user.country,
                submittedBy: user.id,
                submittedByName: user.name,
                submittedAt: new Date().toISOString(),
                status: status,
                reportingPeriod: `${formData.reportingPeriod} ${formData.reportingYear} `,
                templateVersion: 'QEDS/DMFAS v1.0',
                data: {
                    ...formData,
                    // Computed totals
                    totalExternalDebt,
                    totalDomesticDebt,
                    totalPublicDebt: totalExternalDebt + totalDomesticDebt
                }
            };

            saveSubmission(submission);
            setSuccess(status === 'draft'
                ? 'Draft saved successfully!'
                : 'Submission sent for review!'
            );

            setTimeout(() => {
                navigate('/admin/submissions');
            }, 2000);
        } catch (err) {
            setParseError('Error saving submission. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Download QEDS-style template
    const downloadTemplate = async () => {
        const workbook = new ExcelJS.Workbook();

        // Readme Sheet
        const readme = workbook.addWorksheet('README');
        readme.columns = [{ width: 30 }, { width: 50 }];
        readme.addRow(['DEBT DATA REPORTING TEMPLATE']);
        readme.addRow(['Version', 'QEDS/DMFAS Aligned v1.0']);
        readme.addRow(['Reporting Country', user?.country || '']);
        readme.addRow(['Reporting Period', 'yyyyQ# (e.g., 2024Q4)']);
        readme.addRow(['Currency', 'USD']);
        readme.addRow(['Scale', 'Millions']);
        readme.addRow(['']);
        readme.addRow(['INSTRUCTIONS:']);
        readme.addRow(['1. Fill in data in the "Data Entry" sheet']);
        readme.addRow(['2. Use consistent units (USD millions)']);
        readme.addRow(['3. Leave cells blank if data unavailable']);
        readme.addRow(['4. Upload completed file to the DMO Portal']);

        // Data Entry Sheet
        const dataSheet = workbook.addWorksheet('Data Entry');
        dataSheet.columns = [
            { header: 'Category', key: 'category', width: 40 },
            { header: 'Variable', key: 'variable', width: 35 },
            { header: 'Value (USD millions)', key: 'value', width: 20 },
            { header: 'Notes', key: 'notes', width: 30 }
        ];

        // Header styling
        dataSheet.getRow(1).font = { bold: true };
        dataSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '4472C4' } };
        dataSheet.getRow(1).font = { color: { argb: 'FFFFFF' }, bold: true };

        const sections = [
            { category: 'EXTERNAL DEBT BY SECTOR', variable: '', value: '', notes: '' },
            { category: 'General Government', variable: 'Long-term', value: '', notes: '' },
            { category: 'General Government', variable: 'Short-term', value: '', notes: '' },
            { category: 'Central Bank', variable: 'Long-term', value: '', notes: '' },
            { category: 'Central Bank', variable: 'Short-term', value: '', notes: '' },
            { category: 'Deposit-Taking Corporations', variable: 'Long-term', value: '', notes: '' },
            { category: 'Deposit-Taking Corporations', variable: 'Short-term', value: '', notes: '' },
            { category: 'Other Sectors', variable: 'Long-term', value: '', notes: '' },
            { category: 'Other Sectors', variable: 'Short-term', value: '', notes: '' },
            { category: 'Direct Investment', variable: 'Intercompany Lending', value: '', notes: '' },
            { category: '', variable: '', value: '', notes: '' },
            { category: 'EXTERNAL DEBT BY CREDITOR TYPE', variable: '', value: '', notes: '' },
            { category: 'Multilateral', variable: 'World Bank (IBRD + IDA)', value: '', notes: '' },
            { category: 'Multilateral', variable: 'IMF', value: '', notes: '' },
            { category: 'Multilateral', variable: 'African Development Bank', value: '', notes: '' },
            { category: 'Multilateral', variable: 'Other Multilateral', value: '', notes: '' },
            { category: 'Bilateral', variable: 'Paris Club', value: '', notes: '' },
            { category: 'Bilateral', variable: 'China', value: '', notes: '' },
            { category: 'Bilateral', variable: 'Other Bilateral', value: '', notes: '' },
            { category: 'Commercial', variable: 'Bonds/Eurobonds', value: '', notes: '' },
            { category: 'Commercial', variable: 'Commercial Banks', value: '', notes: '' },
            { category: 'Commercial', variable: 'Other Commercial', value: '', notes: '' },
            { category: '', variable: '', value: '', notes: '' },
            { category: 'EXTERNAL DEBT BY INSTRUMENT', variable: '', value: '', notes: '' },
            { category: 'Instruments', variable: 'Debt Securities', value: '', notes: '' },
            { category: 'Instruments', variable: 'Loans', value: '', notes: '' },
            { category: 'Instruments', variable: 'Trade Credits', value: '', notes: '' },
            { category: 'Instruments', variable: 'Currency & Deposits', value: '', notes: '' },
            { category: 'Instruments', variable: 'SDR Allocations', value: '', notes: '' },
            { category: 'Instruments', variable: 'Other Debt Liabilities', value: '', notes: '' },
            { category: '', variable: '', value: '', notes: '' },
            { category: 'DOMESTIC DEBT', variable: '', value: '', notes: '' },
            { category: 'Domestic', variable: 'Treasury Bills (<1 year)', value: '', notes: '' },
            { category: 'Domestic', variable: 'Treasury Bonds (>1 year)', value: '', notes: '' },
            { category: 'Domestic', variable: 'Central Bank Advances', value: '', notes: '' },
            { category: 'Domestic', variable: 'Commercial Bank Loans', value: '', notes: '' },
            { category: 'Domestic', variable: 'Suppliers Credits', value: '', notes: '' },
            { category: 'Domestic', variable: 'Arrears', value: '', notes: '' },
            { category: 'Domestic', variable: 'Other', value: '', notes: '' },
            { category: '', variable: '', value: '', notes: '' },
            { category: 'DEBT SERVICE (Annual)', variable: '', value: '', notes: '' },
            { category: 'External', variable: 'Principal Payments', value: '', notes: '' },
            { category: 'External', variable: 'Interest Payments', value: '', notes: '' },
            { category: 'Domestic', variable: 'Principal Payments', value: '', notes: '' },
            { category: 'Domestic', variable: 'Interest Payments', value: '', notes: '' },
            { category: '', variable: '', value: '', notes: '' },
            { category: 'KEY RATIOS (%)', variable: '', value: '', notes: '' },
            { category: 'Sustainability', variable: 'Total Debt / GDP', value: '', notes: '' },
            { category: 'Sustainability', variable: 'External Debt / GDP', value: '', notes: '' },
            { category: 'Sustainability', variable: 'Debt Service / Exports', value: '', notes: '' },
            { category: 'Sustainability', variable: 'Debt Service / Revenue', value: '', notes: '' },
            { category: 'Sustainability', variable: 'Interest / Revenue', value: '', notes: '' },
            { category: '', variable: '', value: '', notes: '' },
            { category: 'MACROECONOMIC CONTEXT', variable: '', value: '', notes: '' },
            { category: 'Macro', variable: 'Nominal GDP', value: '', notes: '' },
            { category: 'Macro', variable: 'Real GDP Growth (%)', value: '', notes: '' },
            { category: 'Macro', variable: 'Exports of Goods & Services', value: '', notes: '' },
            { category: 'Macro', variable: 'Government Revenue', value: '', notes: '' },
            { category: 'Macro', variable: 'Exchange Rate (LCU/USD)', value: '', notes: '' },
            { category: 'Macro', variable: 'Inflation Rate (%)', value: '', notes: '' },
            { category: 'Macro', variable: 'International Reserves', value: '', notes: '' },
            { category: '', variable: '', value: '', notes: '' },
            { category: 'CONTINGENT LIABILITIES', variable: '', value: '', notes: '' },
            { category: 'Contingent', variable: 'Government Guarantees', value: '', notes: '' },
            { category: 'Contingent', variable: 'PPP Liabilities', value: '', notes: '' },
            { category: 'Contingent', variable: 'SOE Debt', value: '', notes: '' },
            { category: 'Contingent', variable: 'Other', value: '', notes: '' }
        ];

        sections.forEach((row, index) => {
            const excelRow = dataSheet.addRow(row);
            // Style section headers
            if (row.variable === '' && row.category !== '') {
                excelRow.font = { bold: true };
                excelRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E7E6E6' } };
            }
        });

        // Generate and download
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Debt_Data_Template_${user?.country || 'Country'}_${formData.reportingYear}.xlsx`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const inputStyle = {
        width: '100%',
        padding: '10px 12px',
        border: '2px solid #e2e8f0',
        borderRadius: 8,
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: 4,
        fontSize: '0.8rem',
        fontWeight: 600,
        color: '#374151'
    };

    const SectionHeader = ({ title, icon: Icon, section, color = '#3b82f6' }) => (
        <button
            onClick={() => setActiveSection(activeSection === section ? '' : section)}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '1rem',
                background: activeSection === section ? color : '#f8fafc',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                marginBottom: 8
            }}
        >
            <Icon size={20} color={activeSection === section ? '#fff' : color} />
            <span style={{
                flex: 1,
                textAlign: 'left',
                fontWeight: 600,
                color: activeSection === section ? '#fff' : '#1a1a2e'
            }}>
                {title}
            </span>
            <ChevronDown
                size={18}
                color={activeSection === section ? '#fff' : '#64748b'}
                style={{ transform: activeSection === section ? 'rotate(180deg)' : 'none', transition: '0.2s' }}
            />
        </button>
    );

    const InputField = ({ label, name, placeholder = '', suffix = '' }) => (
        <div>
            <label style={labelStyle}>{label}</label>
            <div style={{ position: 'relative' }}>
                <input
                    type="number"
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    style={{ ...inputStyle, paddingRight: suffix ? 40 : 12 }}
                />
                {suffix && (
                    <span style={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94a3b8',
                        fontSize: '0.8rem'
                    }}>
                        {suffix}
                    </span>
                )}
            </div>
        </div>
    );

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {/* Template Info Banner */}
            <div style={{
                background: 'linear-gradient(135deg, #1e3a5f 0%, #0f4c75 100%)',
                borderRadius: 16,
                padding: '1.5rem',
                marginBottom: '1.5rem',
                color: '#fff'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Globe size={24} />
                    <h2 style={{ margin: 0, fontSize: '1.2rem' }}>
                        Debt Data Reporting (QEDS/DMFAS Standard)
                    </h2>
                </div>
                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9rem' }}>
                    This form follows the World Bank QEDS and UNCTAD DMFAS data collection standards for comprehensive debt reporting.
                </p>
            </div>

            {/* File Upload Section */}
            <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '1.5rem',
                border: '2px dashed #cbd5e1',
                marginBottom: '1.5rem',
                textAlign: 'center'
            }}>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                />

                {uploadedFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        <FileSpreadsheet size={24} color="#22c55e" />
                        <span style={{ fontWeight: 500 }}>{uploadedFile.name}</span>
                        <button
                            onClick={() => { setUploadedFile(null); }}
                            style={{
                                background: '#fee2e2',
                                border: 'none',
                                borderRadius: 6,
                                padding: 6,
                                cursor: 'pointer'
                            }}
                        >
                            <X size={16} color="#dc2626" />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload size={40} color="#94a3b8" style={{ marginBottom: 12 }} />
                        <p style={{ margin: '0 0 12px', color: '#64748b' }}>
                            Upload Excel/CSV file following QEDS or DMFAS format
                        </p>
                        <button
                            onClick={() => fileInputRef.current.click()}
                            style={{
                                background: '#3b82f6',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '10px 20px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginRight: 12
                            }}
                        >
                            Browse Files
                        </button>
                        <button
                            onClick={downloadTemplate}
                            style={{
                                background: '#fff',
                                color: '#3b82f6',
                                border: '2px solid #3b82f6',
                                borderRadius: 8,
                                padding: '8px 16px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6
                            }}
                        >
                            <Download size={16} /> Download QEDS Template
                        </button>
                    </>
                )}
            </div>

            {/* Alerts */}
            {parseError && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 10,
                    marginBottom: '1rem',
                    color: '#dc2626'
                }}>
                    <AlertCircle size={18} />
                    {parseError}
                </div>
            )}

            {success && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 16px',
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 10,
                    marginBottom: '1rem',
                    color: '#166534'
                }}>
                    <CheckCircle size={18} />
                    {success}
                </div>
            )}

            {/* Reporting Period */}
            <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={18} color="#3b82f6" />
                    Reporting Metadata
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr ' : 'repeat(4, 1fr)', gap: 16 }}>
                    <div>
                        <label style={labelStyle}>Period *</label>
                        <select
                            name="reportingPeriod"
                            value={formData.reportingPeriod}
                            onChange={handleChange}
                            required
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            <option value="">Select</option>
                            <option value="Q1">Q1</option>
                            <option value="Q2">Q2</option>
                            <option value="Q3">Q3</option>
                            <option value="Q4">Q4</option>
                            <option value="Annual">Annual</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Year *</label>
                        <select
                            name="reportingYear"
                            value={formData.reportingYear}
                            onChange={handleChange}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            {[2025, 2024, 2023, 2022, 2021, 2020].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Currency</label>
                        <select
                            name="reportingCurrency"
                            value={formData.reportingCurrency}
                            onChange={handleChange}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="LCU">Local Currency</option>
                        </select>
                    </div>
                    <div>
                        <label style={labelStyle}>Scale</label>
                        <select
                            name="reportingScale"
                            value={formData.reportingScale}
                            onChange={handleChange}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            <option value="millions">Millions</option>
                            <option value="thousands">Thousands</option>
                            <option value="units">Units</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Form Sections */}
            <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem'
            }}>
                {/* External Debt by Sector */}
                <SectionHeader title="Table 1: External Debt by Sector" icon={Globe} section="external" color="#0369a1" />
                {activeSection === 'external' && (
                    <div style={{ padding: '1rem', background: '#f0f9ff', borderRadius: 10, marginBottom: 12 }}>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 16 }}>
                            Following BPM6/QEDS classification by institutional sector and maturity
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                            <div style={{ gridColumn: isMobile ? 'auto' : '1 / -1', fontWeight: 600, color: '#0369a1', borderBottom: '1px solid #bae6fd', paddingBottom: 8, marginBottom: 8 }}>
                                General Government
                            </div>
                            <InputField label="Long-term" name="gg_longTerm" />
                            <InputField label="Short-term" name="gg_shortTerm" />
                            <div style={{ display: isMobile ? 'none' : 'block' }} />

                            <div style={{ gridColumn: isMobile ? 'auto' : '1 / -1', fontWeight: 600, color: '#0369a1', borderBottom: '1px solid #bae6fd', paddingBottom: 8, marginTop: 12, marginBottom: 8 }}>
                                Central Bank
                            </div>
                            <InputField label="Long-term" name="cb_longTerm" />
                            <InputField label="Short-term" name="cb_shortTerm" />
                            <div />

                            <div style={{ gridColumn: '1 / -1', fontWeight: 600, color: '#0369a1', borderBottom: '1px solid #bae6fd', paddingBottom: 8, marginTop: 12, marginBottom: 8 }}>
                                Deposit-Taking Corporations (Banks)
                            </div>
                            <InputField label="Long-term" name="dtc_longTerm" />
                            <InputField label="Short-term" name="dtc_shortTerm" />
                            <div />

                            <div style={{ gridColumn: '1 / -1', fontWeight: 600, color: '#0369a1', borderBottom: '1px solid #bae6fd', paddingBottom: 8, marginTop: 12, marginBottom: 8 }}>
                                Other Sectors
                            </div>
                            <InputField label="Long-term" name="os_longTerm" />
                            <InputField label="Short-term" name="os_shortTerm" />
                            <InputField label="Direct Investment (Intercompany)" name="di_debtLiabilities" />
                        </div>
                    </div>
                )}

                {/* External Debt by Creditor */}
                <SectionHeader title="Table 2: External Debt by Creditor Type" icon={Users} section="creditor" color="#7c3aed" />
                {activeSection === 'creditor' && (
                    <div style={{ padding: '1rem', background: '#faf5ff', borderRadius: 10, marginBottom: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                            <div style={{ gridColumn: '1 / -1', fontWeight: 600, color: '#7c3aed', borderBottom: '1px solid #ddd6fe', paddingBottom: 8, marginBottom: 8 }}>
                                Multilateral Creditors
                            </div>
                            <InputField label="World Bank (IBRD + IDA)" name="ext_multilateral_wb" />
                            <InputField label="IMF" name="ext_multilateral_imf" />
                            <InputField label="African Development Bank" name="ext_multilateral_afdb" />
                            <InputField label="Other Multilateral" name="ext_multilateral_other" />

                            <div style={{ gridColumn: '1 / -1', fontWeight: 600, color: '#7c3aed', borderBottom: '1px solid #ddd6fe', paddingBottom: 8, marginTop: 12, marginBottom: 8 }}>
                                Bilateral Creditors
                            </div>
                            <InputField label="Paris Club" name="ext_bilateral_parisClub" />
                            <InputField label="China" name="ext_bilateral_china" />
                            <InputField label="Other Bilateral" name="ext_bilateral_other" />

                            <div style={{ gridColumn: '1 / -1', fontWeight: 600, color: '#7c3aed', borderBottom: '1px solid #ddd6fe', paddingBottom: 8, marginTop: 12, marginBottom: 8 }}>
                                Commercial Creditors
                            </div>
                            <InputField label="Bonds / Eurobonds" name="ext_commercial_bonds" />
                            <InputField label="Commercial Banks" name="ext_commercial_banks" />
                            <InputField label="Other Commercial" name="ext_commercial_other" />
                        </div>
                    </div>
                )}

                {/* External Debt by Instrument */}
                <SectionHeader title="Table 3: External Debt by Instrument" icon={CreditCard} section="instrument" color="#059669" />
                {activeSection === 'instrument' && (
                    <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: 10, marginBottom: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                            <InputField label="Debt Securities (Bonds, Notes)" name="inst_debtSecurities" />
                            <InputField label="Loans" name="inst_loans" />
                            <InputField label="Trade Credits & Advances" name="inst_tradeCredits" />
                            <InputField label="Currency & Deposits" name="inst_currencyDeposits" />
                            <InputField label="SDR Allocations" name="inst_sdrAllocations" />
                            <InputField label="Other Debt Liabilities" name="inst_otherDebtLiabilities" />
                        </div>
                    </div>
                )}

                {/* Domestic Debt */}
                <SectionHeader title="Table 4: Domestic Debt" icon={Landmark} section="domestic" color="#dc2626" />
                {activeSection === 'domestic' && (
                    <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: 10, marginBottom: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                            <InputField label="Treasury Bills (< 1 year)" name="dom_tbills" />
                            <InputField label="Treasury Bonds (> 1 year)" name="dom_tbonds" />
                            <InputField label="Central Bank Advances" name="dom_cbAdvances" />
                            <InputField label="Commercial Bank Loans" name="dom_commercialLoans" />
                            <InputField label="Suppliers' Credits" name="dom_suppliersCredits" />
                            <InputField label="Domestic Arrears" name="dom_arrears" />
                            <InputField label="Other Domestic Debt" name="dom_other" />
                        </div>
                    </div>
                )}

                {/* Debt Service */}
                <SectionHeader title="Table 5: Debt Service (Annual)" icon={DollarSign} section="service" color="#ea580c" />
                {activeSection === 'service' && (
                    <div style={{ padding: '1rem', background: '#fff7ed', borderRadius: 10, marginBottom: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
                            <div style={{ background: '#ffedd5', padding: 16, borderRadius: 8 }}>
                                <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#c2410c' }}>External Debt Service</h4>
                                <div style={{ display: 'grid', gap: 12 }}>
                                    <InputField label="Principal Payments" name="ds_principalExternal" />
                                    <InputField label="Interest Payments" name="ds_interestExternal" />
                                </div>
                            </div>
                            <div style={{ background: '#ffedd5', padding: 16, borderRadius: 8 }}>
                                <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', color: '#c2410c' }}>Domestic Debt Service</h4>
                                <div style={{ display: 'grid', gap: 12 }}>
                                    <InputField label="Principal Payments" name="ds_principalDomestic" />
                                    <InputField label="Interest Payments" name="ds_interestDomestic" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Key Ratios */}
                <SectionHeader title="Table 6: Key Debt Sustainability Ratios" icon={Percent} section="ratios" color="#0891b2" />
                {activeSection === 'ratios' && (
                    <div style={{ padding: '1rem', background: '#ecfeff', borderRadius: 10, marginBottom: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                            <InputField label="Total Debt / GDP" name="ratio_debtToGdp" suffix="%" />
                            <InputField label="External Debt / GDP" name="ratio_externalDebtToGdp" suffix="%" />
                            <InputField label="Debt Service / Exports" name="ratio_debtServiceToExports" suffix="%" />
                            <InputField label="Debt Service / Revenue" name="ratio_debtServiceToRevenue" suffix="%" />
                            <InputField label="Interest / Revenue" name="ratio_interestToRevenue" suffix="%" />
                            <InputField label="External Debt / Exports" name="ratio_externalDebtToExports" suffix="%" />
                        </div>
                    </div>
                )}

                {/* Macroeconomic Context */}
                <SectionHeader title="Table 7: Macroeconomic Context" icon={TrendingUp} section="macro" color="#4f46e5" />
                {activeSection === 'macro' && (
                    <div style={{ padding: '1rem', background: '#eef2ff', borderRadius: 10, marginBottom: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: 12 }}>
                            <InputField label="Nominal GDP" name="macro_gdpNominal" />
                            <InputField label="Real GDP Growth" name="macro_gdpReal" suffix="%" />
                            <InputField label="Exports of Goods & Services" name="macro_exports" />
                            <InputField label="Imports of Goods & Services" name="macro_imports" />
                            <InputField label="Government Revenue" name="macro_govRevenue" />
                            <InputField label="Government Expenditure" name="macro_govExpenditure" />
                            <InputField label="Primary Fiscal Balance" name="macro_primaryBalance" />
                            <InputField label="Exchange Rate (LCU/USD)" name="macro_exchangeRate" />
                            <InputField label="Inflation Rate" name="macro_inflation" suffix="%" />
                            <InputField label="International Reserves" name="macro_reserves" />
                        </div>
                    </div>
                )}

                {/* Contingent Liabilities */}
                <SectionHeader title="Contingent Liabilities" icon={PiggyBank} section="contingent" color="#be185d" />
                {activeSection === 'contingent' && (
                    <div style={{ padding: '1rem', background: '#fdf2f8', borderRadius: 10, marginBottom: 12 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 12 }}>
                            <InputField label="Government Guarantees" name="cont_guarantees" />
                            <InputField label="PPP-related Liabilities" name="cont_pppLiabilities" />
                            <InputField label="State-Owned Enterprise Debt" name="cont_soeDebt" />
                            <InputField label="Other Contingent Liabilities" name="cont_other" />
                        </div>
                    </div>
                )}
            </div>

            {/* Notes */}
            <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Additional Information</h3>
                <div style={{ display: 'grid', gap: 12 }}>
                    <div>
                        <label style={labelStyle}>Data Source</label>
                        <input
                            name="dataSource"
                            value={formData.dataSource}
                            onChange={handleChange}
                            placeholder="e.g., Ministry of Finance, Central Bank, DMFAS"
                            style={inputStyle}
                        />
                    </div>
                    <div>
                        <label style={labelStyle}>Notes & Methodology</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Add any notes about methodology, data gaps, or special circumstances..."
                            rows={3}
                            style={{ ...inputStyle, resize: 'vertical' }}
                        />
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                    onClick={() => handleSubmit('draft')}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 24px',
                        background: '#f1f5f9',
                        border: '1px solid #e2e8f0',
                        borderRadius: 10,
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        color: '#64748b'
                    }}
                >
                    <Save size={18} />
                    Save as Draft
                </button>
                <button
                    onClick={() => handleSubmit('pending')}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '12px 24px',
                        background: loading ? '#94a3b8' : 'linear-gradient(135deg, #0369a1, #7c3aed)',
                        border: 'none',
                        borderRadius: 10,
                        fontWeight: 600,
                        cursor: loading ? 'not-allowed' : 'pointer',
                        color: '#fff',
                        boxShadow: '0 4px 14px rgba(3, 105, 161, 0.4)'
                    }}
                >
                    <Send size={18} />
                    {loading ? 'Submitting...' : 'Submit for Review'}
                </button>
            </div>
        </div>
    );
};

export default DataEntryForm;
