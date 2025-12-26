export const SHIPPING_RATES = {
    BANDUNG_RAYA: 10000, // Cheapest (Local)
    JAVA: 15000,
    OUTER_JAVA: 25000,
};

// BANDUNG RAYA (Origin: Bandung)
// 3204 = Kab Bandung
// 3217 = Kab Bandung Barat
// 3273 = Kota Bandung
// 3277 = Kota Cimahi
export const BANDUNG_RAYA_IDS = [
    '3204', '3217', '3273', '3277'
];

// PHP/Banten/Jogja/Jateng/Jatim Province IDs
// 1 = Bali, 2 = Bangka Belitung, 3 = Banten, 4 = Bengkulu, 5 = DI Yogyakarta, 6 = DKI Jakarta
// 10 = Jawa Tengah, 11 = Jawa Timur, 12 = Jawa Barat
export const JAVA_PROVINCE_IDS = [
    '3',  // Banten
    '5',  // DI Yogyakarta
    '6',  // DKI Jakarta (Handled by Jabodetabek logic usually, but technically Java)
    '10', // Jawa Tengah
    '11', // Jawa Timur
    '9'   // Jawa Barat (Updated to match Local JSON ID)
];
