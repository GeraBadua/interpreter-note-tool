import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';  // Para generar UUID

const UserSchema = new mongoose.Schema({
  user_id: {
    type: String,
    default: uuidv4,  // Genera UUID automáticamente
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Interpreter', 'qa', 'Admin', 'tech_support'],
    default: 'Interpreter',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updated_at` on document update
UserSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);

