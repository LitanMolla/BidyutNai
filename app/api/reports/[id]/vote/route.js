import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Report from '@/lib/models/Report';

export async function POST(req, props) {
  try {
    const params = await props.params;
    await dbConnect();
    const { deviceId, voteType } = await req.json();
    
    if (!deviceId || !voteType) {
      return NextResponse.json({ success: false, error: 'Missing deviceId or voteType' }, { status: 400 });
    }

    const report = await Report.findById(params.id);
    if (!report) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    if (report.creatorDeviceId === deviceId) {
      return NextResponse.json({ success: false, error: 'Cannot vote on your own report' }, { status: 403 });
    }

    if (report.votedBy.includes(deviceId)) {
      return NextResponse.json({ success: false, error: 'Already voted' }, { status: 403 });
    }

    if (voteType === 'true') {
      report.votes.trueCount += 1;
    } else if (voteType === 'false') {
      report.votes.falseCount += 1;
    }

    report.votedBy.push(deviceId);
    await report.save();

    return NextResponse.json({ success: true, report });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
