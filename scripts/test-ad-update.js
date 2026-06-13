const fetch = require('node-fetch');

async function testUpdate() {
  try {
    // 1. fetch ads
    const res = await fetch('http://localhost:8080/api/v1/admin/ads');
    const data = await res.json();
    console.log("Ads fetched:", data.ads?.length);
    
    if (!data.ads || data.ads.length === 0) return;
    
    const adId = data.ads[0].id;
    
    // 2. test update
    const FormData = require('form-data');
    const form = new FormData();
    form.append('type', 'hero');
    form.append('page', 'home');
    form.append('redirection_url', 'http://test.com');
    form.append('whatsapp_number', '123456');
    
    // need admin token
    // since we don't have a real token, let's just simulate the request directly
    // Wait, the API requires a valid JWT admin token.
  } catch (err) {
    console.error(err);
  }
}

testUpdate();
