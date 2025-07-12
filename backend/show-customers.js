const { Client } = require('pg');
require('dotenv').config();

async function showCustomers() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('🔍 Fetching existing customers...\n');
    
    const result = await client.query(`
      SELECT id, name, email, role 
      FROM users 
      WHERE role = 'customer' 
      ORDER BY created_at DESC
    `);

    if (result.rows.length === 0) {
      console.log('❌ No customers found in the database.');
      console.log('💡 You can use any valid UUID format for testing.');
      console.log('   Example: 550e8400-e29b-41d4-a716-446655440000');
    } else {
      console.log('✅ Found customers:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      result.rows.forEach((customer, index) => {
        console.log(`${index + 1}. ${customer.name}`);
        console.log(`   Email: ${customer.email}`);
        console.log(`   ID: ${customer.id}`);
        console.log('');
      });
      
      console.log('💡 Copy any of these Customer IDs to use in the booking form!');
    }
  } catch (error) {
    console.error('❌ Error fetching customers:', error.message);
  } finally {
    await client.end();
  }
}

showCustomers(); 