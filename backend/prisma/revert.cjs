const fs = require('fs');
let schema = fs.readFileSync('schema.prisma', 'utf8');

schema = schema.replace(/provider\s*=\s*"sqlite"/, 'provider = "mongodb"');
schema = schema.replace(/"file:\.\/dev\.db"/, 'env("DATABASE_URL")');

schema = schema.replace(/@id @default\(cuid\(\)\)/g, '@id @default(auto()) @map("_id") @db.ObjectId');

// Restore @db.ObjectId for foreign keys
schema = schema.replace(/categoryId\s+String/g, 'categoryId String @db.ObjectId');
schema = schema.replace(/userId\s+String/g, 'userId String @db.ObjectId');
schema = schema.replace(/productId\s+String/g, 'productId String @db.ObjectId');
schema = schema.replace(/orderId\s+String/g, 'orderId String @db.ObjectId');
schema = schema.replace(/senderId\s+String/g, 'senderId String @db.ObjectId');

fs.writeFileSync('schema.prisma', schema);
console.log('MongoDB Conversion Done');
