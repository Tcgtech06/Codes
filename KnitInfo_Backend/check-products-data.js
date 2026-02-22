// Check which companies have products
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProductsData() {
  console.log('🔍 Checking products data in all companies...\n');

  try {
    // Get all companies
    const { data: allCompanies, error } = await supabase
      .from('companies')
      .select('id, company_name, category, products')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error:', error);
      return;
    }

    console.log(`Total companies: ${allCompanies.length}\n`);

    // Count companies with and without products
    const withProducts = allCompanies.filter(c => c.products && c.products.length > 0);
    const withoutProducts = allCompanies.filter(c => !c.products || c.products.length === 0);

    console.log(`✅ Companies WITH products: ${withProducts.length}`);
    console.log(`❌ Companies WITHOUT products: ${withoutProducts.length}\n`);

    // Show companies with products
    if (withProducts.length > 0) {
      console.log('Companies WITH products:');
      console.log('========================');
      withProducts.slice(0, 10).forEach(c => {
        console.log(`- ${c.company_name} (${c.category})`);
        console.log(`  Products: ${c.products.join(', ')}`);
        console.log('');
      });
    }

    // Show companies without products
    if (withoutProducts.length > 0) {
      console.log('\nCompanies WITHOUT products (first 10):');
      console.log('======================================');
      withoutProducts.slice(0, 10).forEach(c => {
        console.log(`- ${c.company_name} (${c.category})`);
      });
    }

    // Group by category
    console.log('\n\nProducts by Category:');
    console.log('=====================');
    const categories = [...new Set(allCompanies.map(c => c.category))];
    categories.forEach(cat => {
      const catCompanies = allCompanies.filter(c => c.category === cat);
      const catWithProducts = catCompanies.filter(c => c.products && c.products.length > 0);
      console.log(`${cat}: ${catWithProducts.length}/${catCompanies.length} have products`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkProductsData();
