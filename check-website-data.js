// Check which companies have website data
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkWebsiteData() {
  console.log('🔍 Checking website data in companies...\n');

  try {
    // Get all companies in Yarn category (from your screenshot)
    const { data: yarnCompanies, error } = await supabase
      .from('companies')
      .select('id, company_name, website, email, phone')
      .eq('category', 'Yarn')
      .limit(10);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`Found ${yarnCompanies.length} companies in Yarn category\n`);

    // Check how many have websites
    const withWebsite = yarnCompanies.filter(c => c.website && c.website.trim() !== '');
    const withoutWebsite = yarnCompanies.filter(c => !c.website || c.website.trim() === '');

    console.log(`✅ Companies WITH website: ${withWebsite.length}`);
    console.log(`❌ Companies WITHOUT website: ${withoutWebsite.length}\n`);

    // Show companies with websites
    if (withWebsite.length > 0) {
      console.log('Companies WITH website:');
      console.log('========================');
      withWebsite.forEach(c => {
        console.log(`- ${c.company_name}`);
        console.log(`  Website: ${c.website}`);
        console.log(`  Email: ${c.email}`);
        console.log('');
      });
    }

    // Show companies without websites
    if (withoutWebsite.length > 0) {
      console.log('\nCompanies WITHOUT website (first 5):');
      console.log('=====================================');
      withoutWebsite.slice(0, 5).forEach(c => {
        console.log(`- ${c.company_name}`);
        console.log(`  Email: ${c.email}`);
        console.log(`  Phone: ${c.phone}`);
        console.log('');
      });
    }

    // Check the specific companies from your screenshot
    console.log('\nChecking specific companies from screenshot:');
    console.log('=============================================');
    const specificCompanies = ['GHCL Ltd', 'Guruvarma Textiles', 'Winsome Textile Industries Ltd'];
    
    for (const name of specificCompanies) {
      const { data: company } = await supabase
        .from('companies')
        .select('company_name, website, email, phone, address')
        .ilike('company_name', `%${name}%`)
        .single();

      if (company) {
        console.log(`\n${company.company_name}:`);
        console.log(`  Website: ${company.website || 'NULL/EMPTY'}`);
        console.log(`  Email: ${company.email}`);
        console.log(`  Phone: ${company.phone}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkWebsiteData();
