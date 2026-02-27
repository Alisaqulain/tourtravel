import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true, maxlength: 20 },
    city: { type: String, trim: true, maxlength: 100 },
    state: { type: String, trim: true, maxlength: 100 },
    country: { type: String, trim: true, maxlength: 100 },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin', 'superadmin'], default: 'user' },
    isBlocked: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: null },
    resetOtpExpires: { type: Date, default: null },
    lastLocationCity: { type: String, default: null },
    lastLocationCountry: { type: String, default: null },
    lastLocationLat: { type: Number, default: null },
    lastLocationLng: { type: Number, default: null },
    lastLocationAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// unique: true on email already creates an index; no need for duplicate schema.index()

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

/** Never include password in JSON output */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// In dev, clear cached model so schema changes (e.g. city, state, country) are picked up without restart
if (process.env.NODE_ENV !== 'production' && mongoose.models.User) {
  delete mongoose.models.User;
}
export const User = mongoose.models.User || mongoose.model('User', userSchema);
