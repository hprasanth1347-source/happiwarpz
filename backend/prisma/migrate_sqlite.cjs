const fs = require('fs');
let schema = fs.readFileSync('schema.prisma', 'utf8');

// Change provider and URL
schema = schema.replace(/provider\s*=\s*"mongodb"/, 'provider = "sqlite"');
schema = schema.replace(/env\("DATABASE_URL"\)/, '"file:./dev.db"');

// Replace MongoDB IDs with SQLite CUIDs
schema = schema.replace(/@id @default\(auto\(\)\) @map\("_id"\) @db\.ObjectId/g, '@id @default(cuid())');
schema = schema.replace(/@db\.ObjectId/g, '');

fs.writeFileSync('schema.prisma', schema);
console.log('SQLite Conversion Done');
