// Check website data for Yarn companies
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function checkYarnWebsites() {
  console.log('🔍 Checking Yarn companies for website data...\n');

  try {
    const { data: companies, error } = await supabase
      .from('companies')
      .select('id, company_name, email, website, created_at')
      .eq('category', 'Yarn')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`Found ${companies.length} Yarn companies\n`);

    const withWebsite = companies.filter(c => c.website && c.website.trim() !== '');
    const withoutWebsite = companies.filter(c => !c.website || c.website.trim() === '');

    console.log(`✅ WITH website: ${withWebsite.length}`);
    console.log(`❌ WITHOUT website: ${withoutWebsite.length}\n`);

    console.log('First 10 companies:');
    console.log('===================');
    companies.slice(0, 10).forEach((c, i) => {
      console.log(`${i + 1}. ${c.company_name}`);
      console.log(`   Email: ${c.email}`);
      console.log(`   Website: ${c.website || 'NULL/EMPTY'}`);
      console.log(`   Created: ${new Date(c.created_at).toLocaleString()}`);
      console.log('');
    });

    // Check specific companies from the Excel screenshot
    console.log('\nChecking specific companies from your Excel:');
    console.log('=============================================');
    const specificNames = ['Amarjothi', 'Banswara', 'Emmar', 'GHCL', 'Guruvarma'];
    
    for (const name of specificNames) {
      const { data: company } = await supabase
        .from('companies')
        .select('company_name, email, website')
        .ilike('company_name', `%${name}%`)
        .limit(1)
        .single();

      if (company) {
        console.log(`\n${company.company_name}:`);
        console.log(`  Email: ${company.email}`);
        console.log(`  Website: ${company.website || 'NULL/EMPTY'}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkYarnWebsites();
