/**
 * Creates the first admin user if none exists.
 * Uses MONGODB_URI and creates admin with ADMIN_EMAIL / ADMIN_PASSWORD from env.
 * Run: npm run seed:admin (loads .env.local via dotenv).
 *
 * Default admin: Triptotravelsofficial@gmail.com (set ADMIN_PASSWORD in .env.local)
 */

const path = require('path');
const fs = require('fs');

// Load .env.local from project root
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (m && !process.env[m[1]]) {
      const val = m[2].replace(/^["']|["']$/g, '').trim();
      process.env[m[1]] = val;
    }
  });
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminEmail = process.env.ADMIN_EMAIL || 'Triptotravelsofficial@gmail.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
const adminName = process.env.ADMIN_NAME || 'Admin';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: null },
    resetOtpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.models?.User || mongoose.model('User', userSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not set. Add it to .env.local or set ADMIN_EMAIL, ADMIN_PASSWORD.');
    process.exit(1);
  }
  await mongoose.connect(uri);
  const existing = await User.findOne({ role: 'admin' });
  if (existing) {
    console.log('Admin already exists:', existing.email);
    await mongoose.disconnect();
    process.exit(0);
    return;
  }
  const existingEmail = await User.findOne({ email: adminEmail });
  if (existingEmail) {
    existingEmail.role = 'admin';
    await existingEmail.save();
    console.log('Updated existing user to admin:', adminEmail);
  } else {
    await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isVerified: true,
    });
    console.log('Admin created:', adminEmail);
  }
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
