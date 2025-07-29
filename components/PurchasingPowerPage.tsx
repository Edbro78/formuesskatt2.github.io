import React, { ChangeEvent, FocusEvent, useMemo } from 'react';

// --- RateTable Component (defined in the same file) ---
interface RateTableData {
    [key: string]: {
        capital: number;
        dividend: number;
        wealth: number;
        inflation: number;
        minInterest: number;
    };
}

interface RateTableProps {
    title: string;
    data: RateTableData;
    isAS?: boolean;
}

const RateTable: React.FC<RateTableProps> = ({ title, data, isAS = false }) => {
    const headers = Object.keys(data);
    const rows = [
        { label: 'Kapitalskatt', key: 'capital' as const },
        { label: 'Utbytteskatt', key: 'dividend' as const },
        { label: 'Formuesskatt', key: 'wealth' as const },
        { label: 'Inflasjon', key: 'inflation' as const },
    ];

    return (
        <div className={`rate-table-container rounded-xl p-4 md:p-6 ${isAS ? 'bg-[#1e3a8a]' : 'bg-[var(--card-bg)]'}`}>
            <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
            <div className="grid grid-cols-[minmax(100px,1.5fr)_repeat(4,minmax(50px,1fr))] gap-4 text-right text-[var(--medium-text)] font-semibold pb-2 border-b border-[var(--border-color)] text-xs">
                <div className="text-left"></div>
                {headers.map(h => <div key={h}>{h}</div>)}
            </div>
            {rows.map(row => (
                <div key={row.label} className="grid grid-cols-[minmax(100px,1.5fr)_repeat(4,minmax(50px,1fr))] gap-4 py-2 border-b border-[var(--border-color)]/50 text-sm last:border-b-0">
                    <div className="font-medium text-[var(--light-text)] text-left">{row.label}</div>
                    {headers.map(h => <div key={h} className="text-right">{(data[h][row.key] * 100).toFixed(2)} %</div>)}
                </div>
            ))}
            <div className="grid grid-cols-[minmax(100px,1.5fr)_repeat(4,minmax(50px,1fr))] gap-4 mt-2 text-base font-bold text-white bg-black/20 -mx-4 md:-mx-6 px-4 md:px-6 py-3">
                <div className="text-left">Minimum bankrente</div>
                {headers.map(h => <div key={h} className="text-right">{data[h].minInterest.toFixed(2)} %</div>)}
            </div>
        </div>
    );
};

// --- PurchasingPowerPage Component ---
interface PurchasingPowerPageProps {
    inflationRate: number;
    onInflationChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onInflationBlur: (e: FocusEvent<HTMLInputElement>) => void;
    taxAsPercentageOfGross: number;
    onNavigateToCalculator: () => void;
}

export const PurchasingPowerPage: React.FC<PurchasingPowerPageProps> = ({
    inflationRate,
    onInflationChange,
    onInflationBlur,
    taxAsPercentageOfGross,
    onNavigateToCalculator,
}) => {
    const { privateRates, asRates } = useMemo(() => {
        const inflation = inflationRate / 100;
        const capitalGainsTax = 0.22;
        const dividendTax = 0.378;

        const wealthTaxRates = {
            'Ingen': 0,
            'Lav': 0.01,
            'Høy': 0.011,
            'Faktisk': taxAsPercentageOfGross
        };

        const privateRatesData: RateTableData = {};
        const asRatesData: RateTableData = {};

        for (const [label, taxRate] of Object.entries(wealthTaxRates)) {
            privateRatesData[label] = {
                capital: capitalGainsTax,
                dividend: 0,
                wealth: taxRate,
                inflation: inflation,
                minInterest: ((inflation + taxRate) / (1 - capitalGainsTax)) * 100
            };
            asRatesData[label] = {
                capital: capitalGainsTax,
                dividend: dividendTax,
                wealth: taxRate,
                inflation: inflation,
                minInterest: (((inflation + taxRate) / (1 - dividendTax)) / (1 - capitalGainsTax)) * 100
            };
        }
        return { privateRates: privateRatesData, asRates: asRatesData };
    }, [inflationRate, taxAsPercentageOfGross]);

    return (
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col">
            <header className="text-center mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">Hvilken bankrente må du ha for å gå i null etter skatt?</h1>
            </header>

            <main className="grid grid-cols-1 flex-grow min-h-0">
                <div className="bg-[var(--card-bg)] p-4 md:p-6 rounded-xl h-full flex flex-col">
                    <div className="mb-6 w-full max-w-xs">
                        <label htmlFor="inflation-rate" className="block text-sm font-medium text-slate-300 mb-2">Forventet inflasjon (%)</label>
                        <input
                            type="text"
                            id="inflation-rate"
                            className="asset-input"
                            value={String(inflationRate)}
                            onChange={onInflationChange}
                            onBlur={onInflationBlur}
                        />
                    </div>
                    <div className="space-y-6 flex-grow overflow-y-auto custom-scrollbar pr-3">
                        <RateTable title="Privat" data={privateRates} />
                        <RateTable title="AS" data={asRates} isAS={true} />
                    </div>
                </div>
            </main>

            <footer className="mt-auto pt-6">
                <div className="text-center w-full max-w-md mx-auto">
                    <button onClick={onNavigateToCalculator} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 text-base">
                        ← Tilbake til kalkulatoren
                    </button>
                </div>
            </footer>
        </div>
    );
};