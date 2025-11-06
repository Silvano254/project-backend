const path = require('path');
const dotenv = require('dotenv');

function loadEnv() {
  // Try loading from multiple possible locations
  const possiblePaths = [
    path.resolve(__dirname, '../../.env'),          // functions/.env
    path.resolve(__dirname, '../../../.env'),       // jirani_mwema_backend/.env
    path.resolve(__dirname, '../../../../.env'),    // Chama/.env (if run from nested dir)
  ];

  let loaded = false;
  for (const envPath of possiblePaths) {
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
      console.log(`✓ Loaded .env from: ${envPath}`);
      loaded = true;
      break;
    }
  }

  if (!loaded) {
    console.warn('⚠ No .env file found; relying on environment variables.');
  }
}

module.exports = { loadEnv };
