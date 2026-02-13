import { NextResponse } from 'next/server';
import connectDB from '@/config/database';
import Company from '@/models/Company';

export async function GET(req) {
  try {
    await connectDB();
    
    // Fetch all companies from the database
    // We select specific fields to keep the payload light for the dropdown
    const companies = await Company.find({})
      .select('name roles eligibleBranches studentExperience') 
      .sort({ name: 1 }); // Sort alphabetically

    return NextResponse.json({ data: companies }, { status: 200 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}