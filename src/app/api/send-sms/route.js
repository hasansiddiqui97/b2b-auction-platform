import twilio from 'twilio';

export async function POST(request) {
  const { phone, verificationCode, name } = await request.json();
  
  if (!phone || !verificationCode) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  
  if (!accountSid || !authToken || !fromNumber) {
    return Response.json({ error: 'Twilio not configured' }, { status: 500 });
  }
  
  const client = twilio(accountSid, authToken);
  
  try {
    const message = await client.messages.create({
      body: `Your Hayaland verification code is: ${verificationCode}`,
      from: fromNumber,
      to: phone
    });
    
    console.log('SMS sent:', message.sid);
    return Response.json({ success: true, sid: message.sid });
  } catch (error) {
    console.error('Twilio error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
