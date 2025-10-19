import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-panel';

// Define user schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  status: String,
  roles: [String],
  activeRole: String,
  role: String,
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

async function verifyRoleConfiguration(): Promise<void> {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

    const users = await User.find({});
    console.log(`Found ${users.length} users in database\n`);

    if (users.length === 0) {
      console.log('⚠️  No users found. Run "npm run seed" to create sample users.\n');
      return;
    }

    let validUsers = 0;
    let usersNeedingFix = 0;
    const issues: string[] = [];

    console.log('Checking user role configurations...\n');

    for (const user of users) {
      const result = validateUserRoles(user);
      
      if (result.valid) {
        validUsers++;
        console.log(`✓ ${user.email}`);
        console.log(`  Roles: ${user.roles?.join(', ') || 'none'}`);
        console.log(`  Active: ${user.activeRole}`);
        console.log(`  Can switch roles: ${(user.roles?.length || 0) > 1 ? 'YES' : 'NO'}\n`);
      } else {
        usersNeedingFix++;
        console.log(`✗ ${user.email}`);
        result.errors.forEach(err => console.log(`  ERROR: ${err}`));
        result.warnings.forEach(warn => console.log(`  WARNING: ${warn}`));
        console.log();
        issues.push(...result.errors);
      }
    }

    console.log('\n=== SUMMARY ===');
    console.log(`Total users: ${users.length}`);
    console.log(`Valid configurations: ${validUsers}`);
    console.log(`Users needing fixes: ${usersNeedingFix}`);

    if (usersNeedingFix > 0) {
      console.log('\n⚠️  Some users have invalid role configurations.');
      console.log('Run "npm run migrate:roles" to fix these issues.\n');
    } else {
      console.log('\n✓ All users have valid role configurations!\n');
    }

    // Check role distribution
    console.log('\n=== ROLE DISTRIBUTION ===');
    const roleCounts: { [key: string]: number } = {};
    const multiRoleUsers = users.filter(u => (u.roles?.length || 0) > 1).length;

    users.forEach(user => {
      user.roles?.forEach((role: string) => {
        roleCounts[role] = (roleCounts[role] || 0) + 1;
      });
    });

    Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([role, count]) => {
        console.log(`  ${role}: ${count} users`);
      });

    console.log(`\nUsers with multiple roles: ${multiRoleUsers}`);
    console.log(`Users with single role: ${users.length - multiRoleUsers}\n`);

    if (multiRoleUsers === 0) {
      console.log('⚠️  No users have multiple roles. Role switching will not be available.');
      console.log('Consider adding more roles to users for testing.\n');
    }

  } catch (error) {
    console.error('Verification error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

function validateUserRoles(user: any): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Check if roles array exists
  if (!user.roles || !Array.isArray(user.roles)) {
    result.valid = false;
    result.errors.push('Missing or invalid roles array');
  } else if (user.roles.length === 0) {
    result.valid = false;
    result.errors.push('Roles array is empty');
  }

  // Check if activeRole exists
  if (!user.activeRole) {
    result.valid = false;
    result.errors.push('Missing activeRole field');
  }

  // Check if activeRole is in roles array
  if (user.activeRole && user.roles && !user.roles.includes(user.activeRole)) {
    result.valid = false;
    result.errors.push(`activeRole '${user.activeRole}' is not in roles array [${user.roles.join(', ')}]`);
  }

  // Warnings
  if (user.roles && user.roles.length === 1) {
    result.warnings.push('User has only one role - role switching will not be available');
  }

  // Check for backward compatibility field
  if (user.role && user.role !== user.activeRole) {
    result.warnings.push(`Backward compatibility field 'role' (${user.role}) differs from activeRole (${user.activeRole})`);
  }

  return result;
}

// Run verification
verifyRoleConfiguration();
