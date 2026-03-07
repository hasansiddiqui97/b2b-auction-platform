import { Resend } from 'resend';

export async function POST(request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  try {
    // This would typically be called by a cron job
    // For now, we'll process a specific auction if provided
    
    const { auction_id } = await request.json();
    
    if (!auction_id) {
      return Response.json({ error: 'auction_id required' }, { status: 400 });
    }
    
    // Fetch auction
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    const auctionRes = await fetch(`${supabaseUrl}/rest/v1/auctions?id=eq.${auction_id}`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    const auctions = await auctionRes.json();
    
    if (!auctions || auctions.length === 0) {
      return Response.json({ error: 'Auction not found' }, { status: 404 });
    }
    
    const auction = auctions[0];
    
    // Check if already closed
    if (auction.status === 'closed') {
      return Response.json({ message: 'Auction already closed' });
    }
    
    // Check if expired
    if (auction.end_time && new Date(auction.end_time) > new Date()) {
      return Response.json({ message: 'Auction not yet expired' });
    }
    
    // Get highest bid
    const bidsRes = await fetch(
      `${supabaseUrl}/rest/v1/bids?auction_id=eq.${auction_id}&select=*,profiles(full_name,email)&order=amount.desc&limit=1`,
      {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      }
    );
    const bids = await bidsRes.json();
    
    let winnerEmail = null;
    let winnerName = null;
    
    if (bids && bids.length > 0) {
      const winner = bids[0];
      winnerEmail = winner.profiles?.email;
      winnerName = winner.profiles?.full_name;
      
      // Update auction as closed with winner
      await fetch(`${supabaseUrl}/rest/v1/auctions?id=eq.${auction_id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          status: 'closed',
          winner_id: winner.bidder_id,
          final_price: winner.amount
        })
      });
      
      // Send winner email
      if (winnerEmail && resend) {
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: winnerEmail,
          subject: `🎉 Congratulations! You won: ${auction.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Congratulations, ${winnerName}!</h1>
              <p>You won the auction for:</p>
              <h2 style="color: #2563eb;">${auction.title}</h2>
              <p>Final bid: <strong>¥${winner.amount.toLocaleString()}</strong></p>
              <p>Please complete your payment to receive the item.</p>
              <a href="https://b2b-auction-platform.vercel.app/auction/${auction_id}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
                Complete Payment
              </a>
            </div>
          `
        });
      }
    } else {
      // No bids - auction closed without winner
      await fetch(`${supabaseUrl}/rest/v1/auctions?id=eq.${auction_id}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          status: 'closed',
          winner_id: null,
          final_price: auction.starting_price
        })
      });
    }
    
    return Response.json({ 
      success: true, 
      winner: winnerName,
      email_sent: !!winnerEmail 
    });
    
  } catch (error) {
    console.error('Close auction error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
