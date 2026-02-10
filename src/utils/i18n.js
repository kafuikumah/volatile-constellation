/**
 * Internationalization (i18n) Infrastructure
 * Simple translation system for multilingual support
 */

// Supported languages
export const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦', rtl: true },
    { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' }
];

// Translation strings
export const translations = {
    en: {
        // Navigation
        'nav.dashboard': 'Dashboard',
        'nav.compare': 'Compare',
        'nav.countries': 'Countries',
        'nav.projections': 'Projections',
        'nav.warnings': 'Early Warnings',
        'nav.creditors': 'Creditor Analysis',
        'nav.benchmark': 'Peer Benchmark',
        'nav.simulator': 'Policy Simulator',
        'nav.timeline': 'Timeline',
        'nav.export': 'Export',

        // Dashboard
        'dashboard.title': 'African Debt Monitoring Mechanism',
        'dashboard.total_debt': 'Total External Debt',
        'dashboard.debt_to_gdp': 'Avg Debt-to-GDP',
        'dashboard.debt_service': 'Annual Debt Service',
        'dashboard.high_risk': 'Countries at High Debt Distress',

        // Risk levels
        'risk.high': 'High Risk',
        'risk.moderate': 'Moderate',
        'risk.low': 'Low Risk',

        // Common
        'common.loading': 'Loading...',
        'common.select_country': 'Select Country',
        'common.export': 'Export',
        'common.filter': 'Filter',
        'common.search': 'Search',
        'common.save': 'Save',
        'common.cancel': 'Cancel'
    },
    fr: {
        // Navigation
        'nav.dashboard': 'Tableau de Bord',
        'nav.compare': 'Comparer',
        'nav.countries': 'Pays',
        'nav.projections': 'Projections',
        'nav.warnings': 'Alertes Précoces',
        'nav.creditors': 'Analyse des Créanciers',
        'nav.benchmark': 'Comparaison des Pairs',
        'nav.simulator': 'Simulateur de Politiques',
        'nav.timeline': 'Chronologie',
        'nav.export': 'Exporter',

        // Dashboard
        'dashboard.title': 'Mécanisme de Suivi de la Dette Africaine',
        'dashboard.total_debt': 'Dette Extérieure Totale',
        'dashboard.debt_to_gdp': 'Ratio Dette/PIB Moyen',
        'dashboard.debt_service': 'Service Annuel de la Dette',
        'dashboard.high_risk': 'Pays à Haut Risque de Surendettement',

        // Risk levels
        'risk.high': 'Risque Élevé',
        'risk.moderate': 'Modéré',
        'risk.low': 'Risque Faible',

        // Common
        'common.loading': 'Chargement...',
        'common.select_country': 'Sélectionner un Pays',
        'common.export': 'Exporter',
        'common.filter': 'Filtrer',
        'common.search': 'Rechercher',
        'common.save': 'Enregistrer',
        'common.cancel': 'Annuler'
    },
    pt: {
        // Navigation
        'nav.dashboard': 'Painel',
        'nav.compare': 'Comparar',
        'nav.countries': 'Países',
        'nav.projections': 'Projeções',
        'nav.warnings': 'Alertas Antecipados',
        'nav.creditors': 'Análise de Credores',
        'nav.benchmark': 'Benchmark de Pares',
        'nav.simulator': 'Simulador de Políticas',
        'nav.timeline': 'Cronologia',
        'nav.export': 'Exportar',

        // Dashboard
        'dashboard.title': 'Mecanismo de Monitoramento da Dívida Africana',
        'dashboard.total_debt': 'Dívida Externa Total',
        'dashboard.debt_to_gdp': 'Rácio Dívida/PIB Médio',
        'dashboard.debt_service': 'Serviço Anual da Dívida',
        'dashboard.high_risk': 'Países em Alto Risco de Sobre-endividamento',

        // Risk levels
        'risk.high': 'Risco Alto',
        'risk.moderate': 'Moderado',
        'risk.low': 'Risco Baixo',

        // Common
        'common.loading': 'Carregando...',
        'common.select_country': 'Selecionar País',
        'common.export': 'Exportar',
        'common.filter': 'Filtrar',
        'common.search': 'Pesquisar',
        'common.save': 'Salvar',
        'common.cancel': 'Cancelar'
    },
    ar: {
        // Navigation
        'nav.dashboard': 'لوحة القيادة',
        'nav.compare': 'مقارنة',
        'nav.countries': 'البلدان',
        'nav.projections': 'التوقعات',
        'nav.warnings': 'إنذارات مبكرة',
        'nav.creditors': 'تحليل الدائنين',
        'nav.benchmark': 'مقارنة الأقران',
        'nav.simulator': 'محاكي السياسات',
        'nav.timeline': 'الجدول الزمني',
        'nav.export': 'تصدير',

        // Dashboard
        'dashboard.title': 'آلية رصد الديون الأفريقية',
        'dashboard.total_debt': 'إجمالي الدين الخارجي',
        'dashboard.debt_to_gdp': 'متوسط نسبة الدين إلى الناتج المحلي',
        'dashboard.debt_service': 'خدمة الدين السنوية',
        'dashboard.high_risk': 'دول في ضائقة ديون عالية',

        // Risk levels
        'risk.high': 'مخاطر عالية',
        'risk.moderate': 'متوسط',
        'risk.low': 'مخاطر منخفضة',

        // Common
        'common.loading': 'جار التحميل...',
        'common.select_country': 'اختر البلد',
        'common.export': 'تصدير',
        'common.filter': 'تصفية',
        'common.search': 'بحث',
        'common.save': 'حفظ',
        'common.cancel': 'إلغاء'
    },
    sw: {
        // Navigation (Swahili)
        'nav.dashboard': 'Dashibodi',
        'nav.compare': 'Linganisha',
        'nav.countries': 'Nchi',
        'nav.projections': 'Makadirio',
        'nav.warnings': 'Tahadhari za Mapema',
        'nav.creditors': 'Uchambuzi wa Wadai',
        'nav.benchmark': 'Kulinganisha na Wenzako',
        'nav.simulator': 'Kiigaji cha Sera',
        'nav.timeline': 'Mstari wa Wakati',
        'nav.export': 'Hamisha',

        // Dashboard
        'dashboard.title': 'Mfumo wa Ufuatiliaji wa Deni la Afrika',
        'dashboard.total_debt': 'Jumla ya Deni la Nje',
        'dashboard.debt_to_gdp': 'Wastani wa Deni/Pato la Taifa',
        'dashboard.debt_service': 'Huduma ya Deni ya Mwaka',
        'dashboard.high_risk': 'Nchi Zenye Hatari Kubwa ya Deni',

        // Risk levels
        'risk.high': 'Hatari Kubwa',
        'risk.moderate': 'Wastani',
        'risk.low': 'Hatari Ndogo',

        // Common
        'common.loading': 'Inapakia...',
        'common.select_country': 'Chagua Nchi',
        'common.export': 'Hamisha',
        'common.filter': 'Chuja',
        'common.search': 'Tafuta',
        'common.save': 'Hifadhi',
        'common.cancel': 'Ghairi'
    }
};

// Get translation function
export const getTranslation = (lang = 'en') => {
    const strings = translations[lang] || translations.en;

    return (key, fallback) => {
        return strings[key] || translations.en[key] || fallback || key;
    };
};

// React hook for translations
export const useTranslation = (lang = 'en') => {
    const t = getTranslation(lang);
    return { t, lang };
};

// Get language direction
export const getLanguageDirection = (lang) => {
    const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === lang);
    return langConfig?.rtl ? 'rtl' : 'ltr';
};
