import { resend } from '@/lib/resend';
import { ApiResponse } from '@/types/api-response';
import VerificationEmail from '@/components/email-template';

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> => {
  try {
    const { error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'Mystery message verification code',
      react: VerificationEmail({
        username: username,
        otp: verificationCode,
      }),
    });

    if (!error)
      return { success: true, message: 'Verification email sent successfully' };

    return { success: false, message: error.message };
  } catch (error) {
    console.error('Error sending verification email', error);
    return { success: false, message: 'Failed to send verification email' };
  }
};
