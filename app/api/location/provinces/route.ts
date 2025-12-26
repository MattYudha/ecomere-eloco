import { NextResponse } from 'next/server';
import provinces from '@/data/locations/provinces.json';

export async function GET() {
    // Return local data directly
    return NextResponse.json(provinces);
}
