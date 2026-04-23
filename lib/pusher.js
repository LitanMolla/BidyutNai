import Pusher from 'pusher';

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || '123',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY || 'abc',
  secret: process.env.PUSHER_SECRET || 'secret',
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
  useTLS: true,
});
