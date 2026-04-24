import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/lib/models/Report';

export async function GET() {
  try {
    await dbConnect();
    // Get Reports sorted by newest
    const reports = await Report.find({}).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, reports });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    // Calculate duration if status is OFF and startTime provided
    let duration = null;
    if (body.status === 'OFF' && body.startTime) {
      const start = new Date(body.startTime);
      const now = new Date();
      duration = Math.round((now - start) / 60000); // duration in minutes
    }
    
    // Delete earlier reports from the same user for the same area
    if (body.creatorDeviceId && body.areaName) {
      await Report.deleteMany({
        creatorDeviceId: body.creatorDeviceId,
        areaName: body.areaName
      });
    }
    
    const newReport = await Report.create({
      ...body,
      duration
    });

    return NextResponse.json({ success: true, report: newReport }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
