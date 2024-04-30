import { Message } from '@/models/user';
import dbConnect from '@/lib/db';
import UserModel from '@/models/user';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, content } = await request.json();
    const user = await UserModel.findOne({ username });
    if (!user)
      return Response.json(
        { status: false, message: 'User not found' },
        { status: 404 }
      );

    if (!user.isAcceptingMessage)
      return Response.json(
        { status: false, message: 'User is not accepting messages' },
        { status: 403 }
      );

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      { status: true, message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.log('Failed to Send Message', error);
    return Response.json(
      { status: false, message: 'Failed to Send Message' },
      { status: 500 }
    );
  }
}
