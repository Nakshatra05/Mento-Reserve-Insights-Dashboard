import { NextResponse } from 'next/server';
import { analyzeReservePortfolio } from '../../../services/zapper';

export async function GET() {
  try {
    const data = await analyzeReservePortfolio();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to fetch reserve data' }, { status: 500 });
  }
} 