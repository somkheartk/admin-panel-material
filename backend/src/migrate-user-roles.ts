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

async function migrateUserRoles() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users
    const users = await User.find({});
    console.log(`Found ${users.length} users in database`);

    let updatedCount = 0;

    for (const user of users) {
      let needsUpdate = false;
      const updates: any = {};

      // Check if user has roles array
      if (!user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
        // If user has old 'role' field, use it to create roles array
        if (user.role) {
          updates.roles = [user.role];
          updates.activeRole = user.role;
          needsUpdate = true;
          console.log(`User ${user.email}: Converting single role '${user.role}' to roles array`);
        } else {
          // Default to 'user' role
          updates.roles = ['user'];
          updates.activeRole = 'user';
          needsUpdate = true;
          console.log(`User ${user.email}: Adding default 'user' role`);
        }
      }

      // Check if user has activeRole
      if (!user.activeRole) {
        // Set activeRole to first role in array
        if (user.roles && user.roles.length > 0) {
          updates.activeRole = user.roles[0];
        } else if (user.role) {
          updates.activeRole = user.role;
        } else {
          updates.activeRole = 'user';
        }
        needsUpdate = true;
        console.log(`User ${user.email}: Setting activeRole to '${updates.activeRole}'`);
      }

      // Validate that activeRole is in roles array
      if (user.activeRole && user.roles && !user.roles.includes(user.activeRole)) {
        updates.roles = [...(user.roles || []), user.activeRole];
        needsUpdate = true;
        console.log(`User ${user.email}: Adding activeRole '${user.activeRole}' to roles array`);
      }

      if (needsUpdate) {
        await User.findByIdAndUpdate(user._id, updates);
        updatedCount++;
        console.log(`✓ Updated user ${user.email}`);
      } else {
        console.log(`✓ User ${user.email} already has correct roles configuration`);
      }
    }

    console.log(`\nMigration completed successfully!`);
    console.log(`Total users: ${users.length}`);
    console.log(`Updated users: ${updatedCount}`);
    console.log(`Skipped users: ${users.length - updatedCount}`);

  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateUserRoles();
