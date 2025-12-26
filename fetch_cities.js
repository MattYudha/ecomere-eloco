const fs = require('fs');
const path = require('path');

// Mappings from Emsifa ID (BPS) to RajaOngkir ID (approximate/standard)
const PROVINCE_MAPPING = {
    "11": "21", "12": "34", "13": "32", "14": "26", "15": "8", "16": "33", "17": "4", "18": "18", "19": "2", "21": "17",
    "31": "6", "32": "9", "33": "10", "34": "5", "35": "11", "36": "3",
    "51": "1", "52": "22", "53": "23",
    "61": "12", "62": "14", "63": "13", "64": "15", "65": "16",
    "71": "31", "72": "29", "73": "28", "74": "30", "75": "7", "76": "27",
    "81": "19", "82": "20",
    "91": "25", "94": "24"
};

const PROVINCES = [
    "11", "12", "13", "14", "15", "16", "17", "18", "19", "21",
    "31", "32", "33", "34", "35", "36",
    "51", "52", "53",
    "61", "62", "63", "64", "65",
    "71", "72", "73", "74", "75", "76",
    "81", "82",
    "91", "94"
];

const OUTPUT_FILE = path.join(__dirname, 'data', 'locations', 'cities.json');

async function fetchCities() {
    let allCities = [];

    // Use loop to fetch sequentially
    for (const pid of PROVINCES) {
        const url = `https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${pid}.json`;
        console.log(`Fetching ${url}...`);

        try {
            const res = await fetch(url);
            if (!res.ok) {
                console.error(`Failed to fetch ${pid}: ${res.status} ${res.statusText}`);
                continue;
            }
            const cities = await res.json();

            // Map structure
            const mapped = cities.map(c => ({
                city_id: c.id, // Keep unique ID (BPS Code)
                province_id: PROVINCE_MAPPING[pid] || pid, // Map to RO-compatible ID
                province: "N/A", // UI fills this
                type: c.name.startsWith('KOTA') ? 'Kota' : 'Kabupaten',
                city_name: c.name.replace('KABUPATEN ', '').replace('KOTA ', ''),
                postal_code: "00000"
            }));

            allCities = allCities.concat(mapped);
            console.log(`  > Got ${mapped.length} cities.`);
        } catch (e) {
            console.error(`Error fetching ${pid}:`, e.message);
        }

        // Slight delay to be nice
        await new Promise(r => setTimeout(r, 100));
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allCities, null, 2));
    console.log(`\nDONE! Saved total ${allCities.length} cities to ${OUTPUT_FILE}`);
}

fetchCities();
