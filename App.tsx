import React, { useState, useMemo, useCallback, ChangeEvent, FocusEvent } from 'react';
import { Page, AssetId, AssetValues, AssetConfig, CalculationResults } from './types.ts';
import { ASSETS_CONFIG } from './constants.ts';
import { calculateWealthTax, formatCurrency, formatNumber, parseNumber } from './services/calculatorService.ts';
import { CalculatorPage } from './components/CalculatorPage.tsx';
import { PurchasingPowerPage } from './components/PurchasingPowerPage.tsx';

const App: React.FC = () => {
    const [page, setPage] = useState<Page>(Page.Calculator);
    
    const initialAssetValues = useMemo(() => 
        ASSETS_CONFIG.reduce((acc, asset) => {
            acc[asset.id] = asset.value;
            return acc;
        }, {} as AssetValues), []);

    const [personCount, setPersonCount] = useState<1 | 2>(1);
    const [privateDebt, setPrivateDebt] = useState<number>(5000000);
    const [assetValues, setAssetValues] = useState<AssetValues>(initialAssetValues);
    const [inflationRate, setInflationRate] = useState<number>(3.0);

    const calculationResults: CalculationResults = useMemo(() => {
        return calculateWealthTax({
            assets: assetValues,
            privateDebt,
            personCount,
        });
    }, [assetValues, privateDebt, personCount]);

    const handleDebtChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPrivateDebt(parseNumber(e.target.value));
    }, []);

    const handleDebtBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
        e.target.value = formatNumber(parseNumber(e.target.value));
    }, []);
    
    const handleInflationChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(',', '.');
        if (/^\d*\.?\d*$/.test(value)) {
            setInflationRate(parseNumber(value, true));
        }
    }, []);

    const handleInflationBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
       const value = parseNumber(e.target.value, true);
       e.target.value = value.toFixed(1);
       setInflationRate(value);
    }, []);

    const handleAssetChange = useCallback((id: AssetId, value: number) => {
        setAssetValues(prev => ({ ...prev, [id]: value }));
    }, []);

    const handleNavigate = useCallback((targetPage: Page) => {
        setPage(targetPage);
    }, []);

    const currentPage = useMemo(() => {
        if (page === Page.Calculator) {
            return (
                <CalculatorPage
                    personCount={personCount}
                    setPersonCount={setPersonCount}
                    privateDebt={privateDebt}
                    onDebtChange={handleDebtChange}
                    onDebtBlur={handleDebtBlur}
                    assetValues={assetValues}
                    onAssetChange={handleAssetChange}
                    results={calculationResults}
                    onNavigateToPurchasingPower={() => handleNavigate(Page.PurchasingPower)}
                />
            );
        }
        return (
            <PurchasingPowerPage
                inflationRate={inflationRate}
                onInflationChange={handleInflationChange}
                onInflationBlur={handleInflationBlur}
                taxAsPercentageOfGross={calculationResults.taxAsPercentageOfGross}
                onNavigateToCalculator={() => handleNavigate(Page.Calculator)}
            />
        );
    }, [page, personCount, privateDebt, assetValues, inflationRate, calculationResults, handleDebtChange, handleDebtBlur, handleInflationChange, handleInflationBlur, handleAssetChange, handleNavigate]);
    
    return (
        <div className="w-full min-h-full flex flex-col items-center justify-start p-4 sm:p-6 md:p-10" style={{backgroundColor: 'var(--dark-blue)'}}>
            {currentPage}
        </div>
    );
};

export default App;