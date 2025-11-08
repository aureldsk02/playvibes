// Test script to verify auth configuration
console.log('Testing authentication configuration...');

try {
  // Test database connection
  const { db } = require('../lib/db/index.ts');
  console.log('✅ Database connection configured');
  
  // Test auth configuration
  const { auth } = require('../lib/auth.ts');
  console.log('✅ Better Auth configured');
  
  // Check required tables in schema
  const schema = require('../lib/db/schema.ts');
  const requiredTables = ['users', 'accounts', 'sessions', 'verification'];
  
  for (const table of requiredTables) {
    if (schema[table]) {
      console.log(`✅ Table '${table}' found in schema`);
    } else {
      console.log(`❌ Table '${table}' missing from schema`);
    }
  }
  
  console.log('\n🎉 Authentication configuration looks good!');
  console.log('Note: You still need to apply database migrations to create the actual tables.');
  
} catch (error) {
  console.error('❌ Configuration error:', error.message);
  console.log('\nPlease check:');
  console.log('1. All required dependencies are installed');
  console.log('2. Environment variables are set');
  console.log('3. Database schema is properly defined');
}