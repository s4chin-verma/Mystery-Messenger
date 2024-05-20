import UserModel from '@/models/user';
import dbConnect from '@/lib/db';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, verifyCode } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === verifyCode;
    const isCodeNotExpired = user.verifyCodeExpiry > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: 'User Verified Successfully',
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: 'Verification code has expired',
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: 'Invalid verification code',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: 'Some Error ocurred in next server',
      },
      { status: 500 }
    );
  }
}
