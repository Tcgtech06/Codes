const fs = require('fs');

async function test() {
  const jwt = require('jsonwebtoken');
  const token = jwt.sign(
    { id: '123', role: 'admin' },
    process.env.JWT_SECRET || 'fallback-secret-for-dev',
    { expiresIn: '1h' }
  );

  const fetch = require('node-fetch');
  const res = await fetch('http://localhost:8080/api/v1/admin/ads');
  const data = await res.json();
  const ad = data.ads && data.ads[0];
  if (!ad) {
    console.log('No ads');
    return;
  }

  const FormData = require('form-data');
  const fd = new FormData();
  fd.append('type', 'hero');
  fd.append('page', 'home');
  fd.append('redirection_url', 'http://test.com');
  fd.append('whatsapp_number', '12345');

  console.log('Updating ad', ad.id);
  const patchRes = await fetch('http://localhost:8080/api/v1/admin/ads/' + ad.id, {
    method: 'PATCH',
    headers: {
      'Authorization': 'Bearer ' + token
    },
    body: fd
  });

  console.log(patchRes.status);
  const patchData = await patchRes.text();
  console.log(patchData);
}

test();
