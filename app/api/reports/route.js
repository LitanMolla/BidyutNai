import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/lib/models/Report';

export async function GET() {
  try {
    await dbConnect();
    // Get Reports sorted by newest
    const reports = await Report.find({}).sort({ createdAt: -1 }).limit(50);
    
    // Calculate accurate total stats
    const totalReports = await Report.countDocuments();
    const onReports = await Report.countDocuments({ status: 'ON' });
    const offReports = await Report.countDocuments({ status: 'OFF' });

    return NextResponse.json({ 
      success: true, 
      reports,
      stats: {
        total: totalReports,
        on: onReports,
        off: offReports
      }
    });
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
    
    // Check global spam limit: 1 report per 5 minutes per device
    if (body.creatorDeviceId) {
      const lastReport = await Report.findOne({ creatorDeviceId: body.creatorDeviceId }).sort({ createdAt: -1 });
      if (lastReport) {
        const diffMs = Date.now() - new Date(lastReport.createdAt).getTime();
        const diffMinutes = diffMs / 60000;
        if (diffMinutes < 5) {
          return NextResponse.json({ 
            success: false, 
            error: `আপনি ৫ মিনিটে ১টির বেশি রিপোর্ট করতে পারবেন না। দয়া করে ${Math.ceil(5 - diffMinutes)} মিনিট অপেক্ষা করুন।` 
          }, { status: 429 });
        }
      }
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
