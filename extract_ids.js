const fs = require('fs');
const path = require('path');
const cities = require('./data/locations/cities.json');

const targets = ['JAKARTA', 'BEKASI', 'BOGOR', 'DEPOK', 'TANGERANG'];

const results = {};

cities.forEach(c => {
    targets.forEach(t => {
        if (c.city_name.includes(t)) {
            if (!results[t]) results[t] = [];
            results[t].push({ id: c.city_id, name: c.city_name, type: c.type });
        }
    });
});

console.log(JSON.stringify(results, null, 2));
