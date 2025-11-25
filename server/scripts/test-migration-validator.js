const MigrationValidator = require('./migration-validator');

async function testMigrationValidator() {
  const validator = new MigrationValidator();

  try {
    console.log('🧪 Testing migration validator...');

    // Test validation
    await validator.validateAllMigrations();

    // Test backup creation
    await validator.createBackup();

    console.log('✅ Migration validator test completed');
  } catch (error) {
    console.error('❌ Migration validator test failed:', error);
  } finally {
    await validator.close();
  }
}

testMigrationValidator();
