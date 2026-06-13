const { Client } = require('pg');
const connectionString = 'postgresql://postgres:Vg3ZHt8mnONSOCZY@db.fykzllskgxgunjrdkopp.supabase.co:5432/postgres';

const initialAds = [
  // Home - Hero
  { type: 'hero', page: 'home', image_url: '/ad1.jpg' },
  { type: 'hero', page: 'home', image_url: '/ad2.jpg' },
  { type: 'hero', page: 'home', image_url: '/ad3.jpg' },
  { type: 'hero', page: 'home', image_url: '/ad4.jpg' },
  { type: 'hero', page: 'home', image_url: '/ad5.jpg' },
  
  // Home - Strip
  { type: 'strip', page: 'home', image_url: '/adst1.jpg' },
  { type: 'strip', page: 'home', image_url: '/adst2.jpg' },
  { type: 'strip', page: 'home', image_url: '/adst3.jpg' },
  { type: 'strip', page: 'home', image_url: '/adst4.jpg' },

  // Catalogue - Strip
  { type: 'strip', page: 'catalogue', image_url: '/adst1.jpg' },
  { type: 'strip', page: 'catalogue', image_url: '/adst2.jpg' },
  { type: 'strip', page: 'catalogue', image_url: '/adst3.jpg' },
  { type: 'strip', page: 'catalogue', image_url: '/adst4.jpg' },
];

async function seedAds() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to Supabase');

    // Optional: Only insert if table is empty
    const { rows } = await client.query('SELECT count(*) FROM ads');
    if (parseInt(rows[0].count) > 0) {
      console.log('Ads table is not empty, skipping seed.');
      return;
    }

    console.log('Seeding initial ads...');
    for (const ad of initialAds) {
      await client.query(
        'INSERT INTO ads (type, page, image_url) VALUES ($1, $2, $3)',
        [ad.type, ad.page, ad.image_url]
      );
    }
    console.log('Successfully seeded initial ads!');
  } catch (err) {
    console.error('Error seeding ads:', err);
  } finally {
    await client.end();
  }
}

seedAds();
