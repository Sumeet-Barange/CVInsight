import { NextResponse } from 'next/server';
import connectDB from '@/config/database';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ message: 'Database Connection Successful!' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Connection Failed', error: error.message }, { status: 500 });
  }
}