export async function GET() {
  try {
    return Response.json(
      {
        success: true,
        message: 'Hello from Next.js!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('API Testing Failed', error);
    return Response.json(
      { success: false, message: 'Some Error ocurred in next server' },
      { status: 500 }
    );
  }
}
