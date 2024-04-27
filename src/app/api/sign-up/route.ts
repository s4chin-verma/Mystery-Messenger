import dbConnect from '@/lib/db';
import UserModel from '@/models/user';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendEmail';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { email, username, password } = await req.json();

    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    const verifyCode = Math.floor(100000 + Math.random() * 9000000).toString();
    const existingUserByEmail = await UserModel.findOne(email);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already existed with this email',
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        email,
        username,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'User Registered Successfully, Please verify you email',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error registering user: ', error);
    return Response.json(
      { success: false, message: 'Error registering user' },
      { status: 500 }
    );
  }
}