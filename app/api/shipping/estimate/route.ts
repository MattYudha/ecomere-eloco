import { NextResponse } from 'next/server';
import { SHIPPING_RATES, BANDUNG_RAYA_IDS, JAVA_PROVINCE_IDS } from '@/config/shippingZones';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { cityId, provinceId } = body;

        if (!cityId || !provinceId) {
            return NextResponse.json(
                { error: 'City ID and Province ID are required' },
                { status: 400 }
            );
        }

        let cost = SHIPPING_RATES.OUTER_JAVA;
        let zone = 'OUTER_JAVA';

        // Check Bandung Raya (Priority 1 - Local)
        if (BANDUNG_RAYA_IDS.includes(String(cityId))) {
            cost = SHIPPING_RATES.BANDUNG_RAYA;
            zone = 'BANDUNG_RAYA';
        }
        // Check Java (Priority 2)
        else if (JAVA_PROVINCE_IDS.includes(String(provinceId))) {
            cost = SHIPPING_RATES.JAVA;
            zone = 'JAVA';
        }

        return NextResponse.json({
            cost,
            zone,
            isEstimated: true,
            currency: 'IDR'
        });

    } catch (error: any) {
        console.error('Shipping estimate error:', error);
        return NextResponse.json(
            { error: 'Failed to calculate shipping' },
            { status: 500 }
        );
    }
}
