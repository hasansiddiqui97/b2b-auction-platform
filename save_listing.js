const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uihexcfjtkegtyzxavbl.supabase.co';
const supabaseKey = 'sb_publishable_b4KkiQCkfsnA647wFy5DXA_x7Ayv3G-';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createListing(data) {
  const auctionData = {
    title: data.title,
    description: data.description,
    category: data.category,
    brand: data.brand,
    model: data.model,
    grade: data.grade,
    condition: data.condition,
    starting_price: parseInt(data.startingPrice),
    reserve_price: data.reservePrice ? parseInt(data.reservePrice) : null,
    buy_now_price: data.buyNowPrice ? parseInt(data.buyNowPrice) : null,
    bid_increment: parseInt(data.bidIncrement) || 1000,
    quantity: parseInt(data.quantity) || 1,
    location: data.location,
    shipping_cost: parseInt(data.shippingCost) || 2500,
    shipping_method: data.shippingMethod,
    payment_methods: data.paymentMethods,
    start_time: data.startTime || new Date().toISOString(),
    end_time: data.endTime,
    current_bid: parseInt(data.startingPrice),
    bid_count: 0,
    status: 'active',
    images: data.images || [],
    seller_id: 'user-001', // Would come from auth
  };

  const { data: result, error } = await supabase
    .from('auctions')
    .insert([auctionData])
    .select();

  if (error) {
    console.error('Error:', error);
    return null;
  }
  console.log('Success:', result);
  return result;
}

// Example
createListing({
  title: 'Test iPhone 15',
  description: 'Test listing',
  category: 'Smartphones',
  brand: 'Apple',
  model: 'iPhone 15',
  grade: 'A',
  condition: 'Excellent',
  startingPrice: '80000',
  bidIncrement: '1000',
  quantity: '1',
  location: 'Tokyo, Japan',
  shippingCost: '2500',
  shippingMethod: 'courier',
  paymentMethods: ['wallet', 'bank_transfer'],
  endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
});
