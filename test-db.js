const mongoose = require('mongoose');

const fs = require('fs');
const path = require('path');

// Load environment variables manually since we aren't in Next.js context
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    console.log(`Loading credentials from ${envPath}...`);
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
} else {
    console.error('Error: .env.local file not found!');
    process.exit(1);
}

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('Error: MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

// Mask the password in the log for security
const maskedUri = uri.replace(/:([^:@]+)@/, ':****@');
console.log(`Attempting to connect to: ${maskedUri}`);

async function testConnection() {
    try {
        await mongoose.connect(uri);
        console.log('✅ SUCCESS: Database connection established successfully!');
        console.log('Your credentials are correct.');
        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ FAILURE: Connection failed.');
        console.error('Error Name:', error.name);
        console.error('Error Message:', error.message);

        if (error.message.includes('bad auth')) {
            console.log('\n--- TROUBLESHOOTING TIPS ---');
            console.log('1. Check your Username and Password.');
            console.log('2. If your password contains special characters (like @, :, %, /), they MUST be URL encoded.');
            console.log('   Example: "p@ssword" should be "p%40ssword"');
            console.log('3. Ensure you are using the correct database name in the path if required.');
        }
    }
}

testConnection();
