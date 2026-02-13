import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// --------------------------------------
// 1. SET YOUR ADMIN CREDENTIALS HERE
// --------------------------------------
const ADMIN_USER = process.env.USERNAME;
const ADMIN_PASS = process.env.PASSWORD; 

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    // Check credentials
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      
      // Set a cookie that expires in 1 day
      const cookieStore = await cookies();
      cookieStore.set('admin_token', 'authenticated', {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}