import { NextResponse } from 'next/server';
import cities from '@/data/locations/cities.json';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('province');

    if (!provinceId) {
        return NextResponse.json({ error: 'Province ID required' }, { status: 400 });
    }

    // Filter cities by provinceId
    // Ensure both are strings for comparison
    const filteredCities = cities.filter((c: any) => String(c.province_id) === String(provinceId));

    return NextResponse.json(filteredCities);
}
