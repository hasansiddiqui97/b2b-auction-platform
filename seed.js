const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://uihexcfjtkegtyzxavbl.supabase.co';
const supabaseKey = 'sb_publishable_b4KkiQCkfsnA647wFy5DXA_x7Ayv3G-';

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleAuctions = [
  {
    title: 'iPhone 15 Pro Max 256GB Natural Titanium',
    description: 'Grade A condition, minor scratches on back. Battery health 94%. Original box included. Japan domestic model.',
    category_id: null,
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    grade: 'A',
    starting_price: 85000,
    buy_now_price: 120000,
    current_bid: 92500,
    bid_count: 23,
    status: 'active',
    start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'],
  },
  {
    title: 'MacBook Pro 14" M3 Pro 18GB/512GB Space Black',
    description: 'Brand new, unopened. Japanese warranty. Perfect for professionals.',
    category_id: null,
    brand: 'Apple',
    model: 'MacBook Pro 14"',
    grade: 'New',
    starting_price: 250000,
    buy_now_price: 320000,
    current_bid: 278000,
    bid_count: 45,
    status: 'active',
    start_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'],
  },
  {
    title: 'iPad Pro 12.9" M2 256GB Silver',
    description: 'Excellent condition, included Apple Pencil 2nd gen. Perfect for designers.',
    category_id: null,
    brand: 'Apple',
    model: 'iPad Pro 12.9"',
    grade: 'A+',
    starting_price: 95000,
    buy_now_price: 140000,
    current_bid: 105000,
    bid_count: 18,
    status: 'active',
    start_time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400'],
  },
  {
    title: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Like new, used for 2 weeks. Original packaging and accessories included.',
    category_id: null,
    brand: 'Sony',
    model: 'WH-1000XM5',
    grade: 'A',
    starting_price: 15000,
    buy_now_price: 25000,
    current_bid: 18500,
    bid_count: 32,
    status: 'active',
    start_time: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400'],
  },
  {
    title: 'Canon EOS R6 Mark II Body',
    description: 'Professional mirrorless camera. Low shutter count (2,500). Comes with extra battery.',
    category_id: null,
    brand: 'Canon',
    model: 'EOS R6 Mark II',
    grade: 'A',
    starting_price: 180000,
    buy_now_price: 240000,
    current_bid: 195000,
    bid_count: 12,
    status: 'active',
    start_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
  },
  {
    title: 'Nintendo Switch OLED Model White',
    description: 'Brand new, sealed. Japanese region free version.',
    category_id: null,
    brand: 'Nintendo',
    model: 'Switch OLED',
    grade: 'New',
    starting_price: 28000,
    buy_now_price: 38000,
    current_bid: 32000,
    bid_count: 28,
    status: 'active',
    start_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    end_time: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
    images: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400'],
  },
];

async function seedAuctions() {
  console.log('Seeding auctions...');
  
  for (const auction of sampleAuctions) {
    const { data, error } = await supabase
      .from('auctions')
      .insert([auction])
      .select();
    
    if (error) {
      console.error('Error inserting auction:', error);
    } else {
      console.log('Inserted:', data[0]?.title);
    }
  }
  
  console.log('Done!');
}

seedAuctions();
