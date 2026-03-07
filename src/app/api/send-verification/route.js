import { Resend } from 'resend';

export async function POST(request) {
  const { email, name, verificationCode } = await request.json();
  
  if (!email || !verificationCode) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    return Response.json({ error: 'RESEND_API_KEY not configured' }, { status: 500 });
  }
  
  const resend = new Resend(apiKey);
  
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your Hayaland Wholesale account',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Welcome to Hayaland Wholesale!</h1>
          <p>Hello ${name || 'there'},</p>
          <p>Thank you for registering. Your verification code is:</p>
          <div style="background: #f5f5f5; padding: 20px; font-size: 32px; letter-spacing: 8px; text-align: center; font-weight: bold; margin: 20px 0;">
            ${verificationCode}
          </div>
          <p>This code expires in 10 minutes.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      `
    });
    
    console.log('Resend response:', data);
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Resend error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
