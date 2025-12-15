
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const content = 'DATABASE_URL="file:D:/project/Structify AI AI powered unstructured data to structured data converter/db/custom.db"';

fs.writeFileSync(envPath, content, 'utf8');
console.log('Fixed .env file');
