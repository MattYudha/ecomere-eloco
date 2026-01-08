// Courier options with services
export interface CourierOption {
    value: string;
    label: string;
    services: string[];
    active: boolean;
}

export const COURIER_OPTIONS: CourierOption[] = [
    { value: 'JNE', label: 'JNE', services: ['REG', 'YES', 'OKE'], active: true },
    { value: 'POS', label: 'POS Indonesia', services: ['Reguler', 'Express', 'Nextday'], active: true },
    { value: 'TIKI', label: 'TIKI', services: ['REG', 'ONS', 'ECO'], active: true },
    { value: 'JNT', label: 'J&T Express', services: ['Reguler', 'Express'], active: true },
    { value: 'SiCepat', label: 'SiCepat', services: ['REG', 'BEST', 'HALU'], active: true },
    { value: 'Anteraja', label: 'Anteraja', services: ['Reguler', 'Next Day'], active: true },
    { value: 'Ninja', label: 'Ninja Xpress', services: ['Reguler', 'Express'], active: true },
    { value: 'IDExpress', label: 'ID Express', services: ['Reguler', 'Cargo'], active: true },
    { value: 'OTHER', label: 'Kurir Lainnya', services: [], active: true }, // Fallback
];

export const COURIER_SERVICES: Record<string, string[]> = {
    JNE: ['REG', 'YES', 'OKE'],
    POS: ['Reguler', 'Express', 'Nextday'],
    TIKI: ['REG', 'ONS', 'ECO'],
    JNT: ['Reguler', 'Express'],
    SiCepat: ['REG', 'BEST', 'HALU'],
    Anteraja: ['Reguler', 'Next Day'],
    Ninja: ['Reguler', 'Express'],
    IDExpress: ['Reguler', 'Cargo'],
    OTHER: [],
};

// Helper function
export function getCourierLabel(value: string): string {
    const courier = COURIER_OPTIONS.find(c => c.value === value);
    return courier?.label || value; // Fallback to raw value
}

// Check if courier is known
export function isKnownCourier(value: string): boolean {
    return COURIER_OPTIONS.some(c => c.value === value && c.value !== 'OTHER');
}
