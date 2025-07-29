import { AssetConfig, AssetId } from './types';

export const ASSETS_CONFIG: AssetConfig[] = [
    { id: 'primary-residence', label: 'Primærbolig', value: 20000000, min: 0, max: 50000000, step: 100000 },
    { id: 'holiday-home', label: 'Fritidseiendom', value: 3000000, min: 0, max: 20000000, step: 50000 },
    { id: 'land-plot', label: 'Tomt', value: 1000000, min: 0, max: 10000000, step: 50000 },
    { id: 'car-boat', label: 'Bil / Båt', value: 500000, min: 0, max: 5000000, step: 10000 },
    { id: 'limited-company', label: 'Aksjeselskap (AS)', value: 10000000, min: 0, max: 100000000, step: 100000 },
    { id: 'private-portfolio', label: 'Privat portefølje (ASK)', value: 2000000, min: 0, max: 50000000, step: 100000 },
    { id: 'secondary-residence', label: 'Sekundærbolig', value: 4000000, min: 0, max: 30000000, step: 100000 },
    { id: 'bank-deposits', label: 'Bankinnskudd', value: 1500000, min: 0, max: 10000000, step: 50000 },
    { id: 'operating-assets', label: 'Driftsmidler', value: 0, min: 0, max: 20000000, step: 50000 },
];

export const DISCOUNTS: Record<AssetId, { valuation_under_threshold: number, valuation_over_threshold: number } | number> = {
    'primary-residence': { valuation_under_threshold: 0.25, valuation_over_threshold: 0.70 },
    'holiday-home': 0.70,
    'land-plot': 0.70,
    'car-boat': 1,
    'limited-company': 0.80,
    'private-portfolio': 0.80,
    'secondary-residence': 1,
    'bank-deposits': 1,
    'operating-assets': 0.70,
};