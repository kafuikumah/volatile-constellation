'use client';

import { AlertTriangle } from 'lucide-react';
import { Country } from '@/types/country';
import { getLatestValue, formatIndicatorValue } from '@/lib/utils';

interface FiscalAlertProps {
    country: Country;
}

export function FiscalAlert({ country }: FiscalAlertProps) {
    const debtService = getLatestValue(country.indicators['debt_service_revenue']);
    const healthBudget = getLatestValue(country.indicators['gghe_gge']);

    if (!debtService?.value || !healthBudget?.value) return null;
    if (debtService.value <= healthBudget.value) return null;

    return (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-sm font-semibold text-amber-800">Fiscal Pressure Alert</p>
                <p className="text-xs text-amber-700 mt-1">
                    Debt service to revenue ({formatIndicatorValue(debtService.value, '%')}) exceeds government health expenditure
                    as % of government expenditure ({formatIndicatorValue(healthBudget.value, '%')}).
                    This may indicate fiscal pressure on health financing.
                </p>
            </div>
        </div>
    );
}
