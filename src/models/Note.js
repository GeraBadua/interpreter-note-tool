import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';  // Para generar UUID

const NoteSchema = new mongoose.Schema({
  note_id: {
    type: String,
    default: uuidv4,  // Genera UUID automáticamente
    unique: true,
  },
  note_title: {
    type: String,
    required: true,
    unique: true,
  },
  topic: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
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
NoteSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);

