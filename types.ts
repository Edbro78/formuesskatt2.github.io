
export enum Page {
  Calculator,
  PurchasingPower,
}

export type AssetId = 
  | 'primary-residence'
  | 'holiday-home'
  | 'land-plot'
  | 'car-boat'
  | 'limited-company'
  | 'private-portfolio'
  | 'secondary-residence'
  | 'bank-deposits'
  | 'operating-assets';

export interface AssetConfig {
  id: AssetId;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
}

export type AssetValues = Record<AssetId, number>;

export interface CalculationInputs {
  assets: AssetValues;
  privateDebt: number;
  personCount: 1 | 2;
}

export interface CalculationResults {
  grossWealth: number;
  totalDiscount: number;
  netWealth: number;
  nonDeductibleDebt: number;
  deductibleDebt: number;
  taxFreeAllowance: number;
  taxableBase: number;
  totalWealthTax: number;
  taxAsPercentageOfGross: number;
}