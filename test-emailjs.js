const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('.env.local not found in project root');
  process.exit(2);
}
const env = fs.readFileSync(envPath, 'utf8').split(/\r?\n/).reduce((acc, line) => {
  const m = line.match(/^([^=]+)=(.*)$/);
  if (m) acc[m[1].trim()] = m[2].trim();
  return acc;
}, {});

const service_id = env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const template_id = env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const user_id = env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const server_key = env.EMAILJS_SERVER_KEY || env.EMAILJS_SERVER_PRIVATE_KEY || env.EMAILJS_SERVER;

if (!service_id || !template_id || !user_id) {
  console.error('Missing EmailJS keys in .env.local');
  console.error({ service_id, template_id, user_id });
  process.exit(2);
}

const payload = {
  service_id,
  template_id,
  user_id,
  template_params: {
    from_name: 'Automated Test',
    message: 'This is a test message from test-emailjs.js',
    reply_to: 'test@example.com'
  }
};

if (server_key) {
  payload.accessToken = server_key;
  console.log('Using server key from .env.local');
}

;(async () => {
  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    console.log('HTTP', res.status, res.statusText);
    try {
      console.log('Response JSON:', JSON.parse(text));
    } catch (e) {
      console.log('Response text:', text);
    }
  } catch (err) {
    console.error('Request error:', err);
    process.exit(1);
  }
})();
