import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chat from '@/lib/models/Chat';
import { pusherServer } from '@/lib/pusher';

export async function GET() {
  try {
    await dbConnect();
    // Get all messages
    const messages = await Chat.find({}).sort({ timestamp: 1 });
    return NextResponse.json({ success: true, messages });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    
    if (!body.senderId || !body.senderName || !body.message) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const newMessage = await Chat.create(body);

    // Trigger pusher if properly configured (checking dummy key)
    if (process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.NEXT_PUBLIC_PUSHER_KEY !== 'dummy_key') {
      await pusherServer.trigger('chat-channel', 'new-message', {
        message: newMessage
      });
    }

    return NextResponse.json({ success: true, message: newMessage });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
