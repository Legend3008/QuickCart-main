/**
 * Seed Script for Help Center Data
 * 
 * This script populates the database with initial help topics and FAQs.
 * Run this once after setting up the Help page to ensure data is available.
 * 
 * Usage:
 *   1. Start your development server: npm run dev
 *   2. Open browser and navigate to: http://localhost:3001/help/seed
 *   3. Or use curl: curl -X POST http://localhost:3001/api/help/topics -H "Content-Type: application/json" -d '{"action":"seed"}'
 *   4. Then: curl -X POST http://localhost:3001/api/help/faqs -H "Content-Type: application/json" -d '{"action":"seed"}'
 */

async function seedHelpData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
  
  console.log('🌱 Starting Help Center data seeding...\n');

  try {
    // Seed Help Topics
    console.log('📚 Seeding Help Topics...');
    const topicsResponse = await fetch(`${baseUrl}/api/help/topics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'seed' })
    });

    const topicsResult = await topicsResponse.json();
    
    if (topicsResult.success) {
      console.log('✅ Help Topics seeded successfully!');
    } else {
      console.log('⚠️  Help Topics may already exist or error occurred:', topicsResult.message);
    }

    // Seed FAQs
    console.log('\n❓ Seeding FAQs...');
    const faqsResponse = await fetch(`${baseUrl}/api/help/faqs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'seed' })
    });

    const faqsResult = await faqsResponse.json();
    
    if (faqsResult.success) {
      console.log('✅ FAQs seeded successfully!');
    } else {
      console.log('⚠️  FAQs may already exist or error occurred:', faqsResult.message);
    }

    console.log('\n🎉 Help Center seeding completed!\n');
    console.log('📝 Summary:');
    console.log('   - Help Topics: 6 categories');
    console.log('   - FAQs: 12 questions across multiple categories');
    console.log('\n🔗 Visit http://localhost:3001/help to see the results!\n');

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    console.log('\n💡 Make sure your server is running on port 3001');
    console.log('   Run: npm run dev\n');
  }
}

// Run the seed function if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
  seedHelpData();
}

export default seedHelpData;
