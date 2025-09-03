import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetSequenceTo100() {
  try {
    console.log('🔄 Resetting database sequences to start from 100...');
    
    // Get current max IDs
    const maxLaptop = await prisma.laptop.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });
    
    const maxImage = await prisma.image.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });
    
    const maxOrder = await prisma.order.findFirst({
      orderBy: { id: 'desc' },
      select: { id: true }
    });
    
    console.log('📊 Current max IDs:');
    console.log(`  Laptop: ${maxLaptop?.id || 0}`);
    console.log(`  Image: ${maxImage?.id || 0}`);
    console.log(`  Order: ${maxOrder?.id || 0}`);
    
    // Determine the next sequence value (minimum 100)
    const nextLaptopId = Math.max(100, (maxLaptop?.id || 0) + 1);
    const nextImageId = Math.max(100, (maxImage?.id || 0) + 1);
    const nextOrderId = Math.max(100, (maxOrder?.id || 0) + 1);
    
    console.log('🎯 Setting sequences to:');
    console.log(`  Laptop: ${nextLaptopId}`);
    console.log(`  Image: ${nextImageId}`);
    console.log(`  Order: ${nextOrderId}`);
    
    // Reset sequences using raw SQL
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Laptop"', 'id'), ${nextLaptopId}, false);`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Image"', 'id'), ${nextImageId}, false);`;
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Order"', 'id'), ${nextOrderId}, false);`;
    
    console.log('✅ Successfully reset all sequences!');
    console.log('🚀 Next IDs will be:');
    console.log(`  Laptop: ${nextLaptopId}`);
    console.log(`  Image: ${nextImageId}`);
    console.log(`  Order: ${nextOrderId}`);
    
  } catch (error) {
    console.error('❌ Error resetting sequences:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

resetSequenceTo100()
  .then(() => {
    console.log('🎉 Sequence reset completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Failed to reset sequences:', error);
    process.exit(1);
  });