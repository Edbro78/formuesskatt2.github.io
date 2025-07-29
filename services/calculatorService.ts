
import { CalculationInputs, CalculationResults, AssetId } from '../types.ts';
import { DISCOUNTS } from '../constants.ts';

export const parseNumber = (str: string, isFloat = false): number => {
    if (typeof str !== 'string') return isNaN(Number(str)) ? 0 : Number(str);
    const cleaned = str.replace(/[^\d,.]/g, '').replace(',', '.');
    const val = isFloat ? parseFloat(cleaned) : parseInt(cleaned, 10);
    return isNaN(val) ? 0 : val;
};

export const formatNumber = (num: number): string => 
    new Intl.NumberFormat('nb-NO').format(isNaN(num) ? 0 : num);

export const formatCurrency = (num: number): string => 
    new Intl.NumberFormat('nb-NO', { 
        style: 'currency', 
        currency: 'NOK', 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    }).format(isNaN(num) ? 0 : num);


export const calculateWealthTax = (inputs: CalculationInputs): CalculationResults => {
    const { assets, privateDebt, personCount } = inputs;
    const primaryResidenceFixedThreshold = 10000000;
    const taxFreeAllowance = personCount === 1 ? 1700000 : 3400000;
    const highRateThreshold = personCount === 1 ? 20000000 : 40000000;

    const grossWealth = Object.values(assets).reduce((sum, val) => sum + val, 0);

    let totalValuedWealth = 0;
    let discountForDebtReduction = 0;

    Object.keys(assets).forEach(key => {
        const assetKey = key as AssetId;
        const assetValue = assets[assetKey];
        let valuedAmount = assetValue;
        
        if (assetKey === 'primary-residence') {
            const valFactors = DISCOUNTS[assetKey] as { valuation_under_threshold: number, valuation_over_threshold: number };
            valuedAmount = (Math.min(assetValue, primaryResidenceFixedThreshold) * valFactors.valuation_under_threshold) +
                           (Math.max(0, assetValue - primaryResidenceFixedThreshold) * valFactors.valuation_over_threshold);
        } else {
            const discountFactor = DISCOUNTS[assetKey];
            valuedAmount = assetValue * (typeof discountFactor === 'number' ? discountFactor : 1);
            const currentDiscount = assetValue - valuedAmount;
            // Add discount to the total used for debt reduction calculation
            discountForDebtReduction += currentDiscount;
        }
        totalValuedWealth += valuedAmount;
    });

    const totalDiscount = grossWealth - totalValuedWealth;
    const netWealth = totalValuedWealth;
    
    // Calculate non-deductible debt based on discounts from assets OTHER than primary residence
    const nonDeductibleDebt = grossWealth > 0 ? (privateDebt * discountForDebtReduction) / grossWealth : 0;
    const deductibleDebt = Math.max(0, privateDebt - nonDeductibleDebt);

    const taxableBase = Math.max(0, netWealth - taxFreeAllowance - deductibleDebt);
    const totalWealthTax = (Math.min(taxableBase, highRateThreshold) * 0.01) + (Math.max(0, taxableBase - highRateThreshold) * 0.011);
    const taxAsPercentageOfGross = grossWealth > 0 ? (totalWealthTax / grossWealth) : 0;

    return {
        grossWealth,
        totalDiscount,
        netWealth,
        nonDeductibleDebt,
        deductibleDebt,
        taxFreeAllowance,
        taxableBase,
        totalWealthTax,
        taxAsPercentageOfGross,
    };
};