import { getServerSession, User } from 'next-auth';
import dbConnect from '@/lib/db';
import UserModel from '@/models/user';
import { authOptions } from '../auth/[...nextauth]/options';

export async function PATCH(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user;
    if (!session || !user)
      return Response.json(
        {
          success: false,
          message: 'User not Authenticated',
        },
        { status: 401 }
      );

    const userId = user._id;
    const { acceptMessages } = await request.json();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser)
      return Response.json(
        { success: false, message: 'User not found' },
        { status: 401 }
      );

    return Response.json(
      {
        success: true,
        message: acceptMessages
          ? 'You are now Accepting messages'
          : 'You are now not accepting messages',
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: 'Failed to update user status to accept messages',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user;

    if (!session || !session.user)
      return Response.json(
        {
          success: false,
          message: 'User not Authenticated',
        },
        { status: 401 }
      );

    const userId = user._id;
    const foundUser = await UserModel.findById(userId);

    if (!foundUser)
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        success: false,
        message: 'Error in getting error accepting status',
      },
      { status: 500 }
    );
  }
}
