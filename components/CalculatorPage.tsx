
import React, { ChangeEvent, FocusEvent } from 'react';
import { AssetId, AssetValues, CalculationResults, AssetConfig } from '../types.ts';
import { ASSETS_CONFIG } from '../constants.ts';
import { formatCurrency, formatNumber } from '../services/calculatorService.ts';

interface AssetSliderProps {
    asset: AssetConfig;
    value: number;
    onChange: (id: AssetId, value: number) => void;
}

const AssetSlider: React.FC<AssetSliderProps> = ({ asset, value, onChange }) => (
    <div className="asset-slider-group">
        <div className="flex justify-between items-baseline mb-1">
            <label htmlFor={asset.id} className="text-sm font-medium text-slate-300">{asset.label}</label>
            <span id={`${asset.id}-value`} className="text-sm font-semibold text-[var(--accent-blue-light)]">
                {formatCurrency(value)}
            </span>
        </div>
        <input
            type="range"
            id={asset.id}
            min={asset.min}
            max={asset.max}
            step={asset.step}
            value={value}
            onChange={(e) => onChange(asset.id, Number(e.target.value))}
        />
    </div>
);

interface CalculatorPageProps {
    personCount: 1 | 2;
    setPersonCount: (count: 1 | 2) => void;
    privateDebt: number;
    onDebtChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDebtBlur: (e: FocusEvent<HTMLInputElement>) => void;
    assetValues: AssetValues;
    onAssetChange: (id: AssetId, value: number) => void;
    results: CalculationResults;
    onNavigateToPurchasingPower: () => void;
}

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
    personCount,
    setPersonCount,
    privateDebt,
    onDebtChange,
    onDebtBlur,
    assetValues,
    onAssetChange,
    results,
    onNavigateToPurchasingPower
}) => {
    return (
        <div className="w-full max-w-7xl mx-auto h-full flex flex-col">
            <header className="text-center mb-6">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-1">Beregning av Formuesskatt</h1>
                <p className="text-sm text-slate-300">Beregn din formuesskatt og se hva som kreves for å bevare kjøpekraften.</p>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-0">
                {/* Kolonne 1: Input */}
                <div className="lg:col-span-1 flex flex-col">
                    <div className="bg-[var(--card-bg)] p-4 md:p-6 rounded-xl h-full flex flex-col">
                        <h2 className="text-xl font-semibold text-white border-b border-[var(--border-color)] pb-2 mb-4">Input</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Antall personer</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setPersonCount(1)} className={`flex-1 font-semibold py-2 px-4 rounded-lg text-sm transition-colors ${personCount === 1 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>1 person</button>
                                    <button onClick={() => setPersonCount(2)} className={`flex-1 font-semibold py-2 px-4 rounded-lg text-sm transition-colors ${personCount === 2 ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>2 personer</button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="private-debt" className="block text-sm font-medium text-slate-300 mb-2">Privat gjeld (NOK)</label>
                                <input type="text" id="private-debt" className="asset-input" defaultValue={formatNumber(privateDebt)} onChange={onDebtChange} onBlur={onDebtBlur} placeholder="0" />
                            </div>
                        </div>
                        <h3 className="text-lg font-semibold text-white border-b border-[var(--border-color)] pb-2 mt-6 mb-4">Eiendeler</h3>
                        <div className="space-y-3 flex-grow overflow-y-auto custom-scrollbar pr-3">
                            {ASSETS_CONFIG.map(asset => (
                                <AssetSlider key={asset.id} asset={asset} value={assetValues[asset.id]} onChange={onAssetChange} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Kolonne 2: Resultater */}
                <div className="lg:col-span-1 flex flex-col">
                    <div className="bg-[var(--card-bg)] p-4 md:p-6 rounded-xl h-full flex flex-col">
                        <h2 className="text-xl font-semibold text-white border-b border-[var(--border-color)] pb-2 mb-4">Resultater</h2>
                        <div className="text-center bg-slate-900/80 p-6 rounded-lg mb-4">
                            <div className="text-4xl font-bold text-[var(--accent-blue-vibrant)] word-break-all">{formatCurrency(results.totalWealthTax)}</div>
                            <div className="mt-2 text-md text-[var(--medium-text)] tracking-wide">Total Formuesskatt</div>
                        </div>
                        <div className="space-y-3 bg-slate-800/60 p-4 rounded-lg flex-grow text-base">
                            <ResultRow label="Bruttoformue:" value={formatCurrency(results.grossWealth)} />
                            <ResultRow label="Verdsettelsesrabatt:" value={formatCurrency(results.totalDiscount)} />
                            <ResultRow label="Nettoformue (etter rabatt):" value={formatCurrency(results.netWealth)} />
                            <ResultRow label="Total gjeld:" value={formatCurrency(privateDebt)} />
                            <ResultRow label="Gjeld ikke til fradrag:" value={formatCurrency(results.nonDeductibleDebt)} />
                            <ResultRow label="Fradragsberettiget gjeld:" value={formatCurrency(results.deductibleDebt)} />
                            <ResultRow label="Fribeløp:" value={formatCurrency(results.taxFreeAllowance)} />
                            <ResultRow label="Skattegrunnlag:" value={formatCurrency(results.taxableBase)} isBold={true} />
                            <div className="flex justify-between items-center text-base text-slate-300 pt-2"><span>Skatteandel av bruttoformue:</span><span className="font-semibold text-white">{(results.taxAsPercentageOfGross * 100).toFixed(2)} %</span></div>
                        </div>
                        <div className="mt-auto pt-4 text-center">
                            <button onClick={onNavigateToPurchasingPower} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 text-base">
                                Analyser kjøpekraft →
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const ResultRow: React.FC<{ label: string; value: string; isBold?: boolean }> = ({ label, value, isBold = false }) => (
    <>
        <div className={`flex justify-between items-center ${isBold ? 'text-lg text-white' : 'text-base text-slate-300'}`}>
            <span className={isBold ? 'font-semibold' : ''}>{label}</span>
            <span className={isBold ? 'font-bold' : 'font-semibold text-white'}>{value}</span>
        </div>
        <hr className="border-[var(--border-color)]/40 my-1" />
    </>
);