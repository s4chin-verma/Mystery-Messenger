import dbConnect from '@/lib/db';
import UserModel from '@/models/user';
import { z } from 'zod';
import { usernameValidation } from '@/validators';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  if (request.method !== 'GET') {
    return Response.json(
      {
        success: false,
        message: 'Only GET requests are allowed',
      },
      { status: 400 }
    );
  }
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = { username: searchParams.get('username') };
    const result = UsernameQuerySchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const user = await UserModel.findOne({ username, isVerified: true });
    if (user) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Username is available',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username', error);
    return Response.json(
      { success: false, message: 'Error Checking username' },
      { status: 500 }
    );
  }
}
