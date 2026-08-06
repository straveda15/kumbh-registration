import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../config/env.js';

// A User is created blank (startRegistration) the moment a QR is scanned,
// before any identity is known — so email/mobile/password stay unset
// (sparse) until the pilgrim fills in Personal Information and sets a
// password. sparse+unique (not sparse+unique+default:null — see
// registration.model.js's own comment on registrationNumber/pilgrimId for
// why default:null breaks a sparse index) so many still-anonymous drafts
// can coexist without colliding on the same unset value.
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      default:     '',
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    mobile: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, config.bcryptSaltRounds);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    mobile: this.mobile,
    isActive: this.isActive,
    createdAt: this.createdAt,
  };
};

export const User = mongoose.model('User', userSchema);

export default User;
