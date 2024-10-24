// app/models/User.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';  // Se puede eliminar si no se necesita

const UserSchema = new mongoose.Schema({
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

// Middleware para actualizar `updated_at` al guardar el documento
UserSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
