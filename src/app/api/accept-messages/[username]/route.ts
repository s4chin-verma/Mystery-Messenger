import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/user';
import dbConnect from '@/lib/db';

type Params = {
  params: {
    username: string;
  };
};

export async function GET(request: NextRequest, { params }: Params) {
  await dbConnect();

  try {
    const { username } = params;

    const foundUser = await UserModel.findOne({ username });

    if (!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: `${username} is not available in our records`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, isAcceptingMessage: foundUser.isAcceptingMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error in getting user accepting message status',
      },
      { status: 500 }
    );
  }
}
