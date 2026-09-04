const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const required = ['MONGO_URI', 'JWT_SECRET', 'OFFICER_REGISTRATION_CODE'];
for (const name of required) {
  if (!process.env[name]) {
    console.error('Missing required environment variable: ' + name);
    process.exit(1);
  }
}
const connectDB = require('./config/db');
const app = require('./app');
const PORT = process.env.PORT || 5001;
async function start() {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => console.log('Server running on port ' + PORT));
}
start().catch(() => { console.error('Server startup failed'); process.exit(1); });
