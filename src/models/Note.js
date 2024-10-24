// app/models/Note.js
import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
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
  user_id: { // Mantener este campo para vincular la nota al usuario
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// Middleware para actualizar `updated_at` al guardar el documento
NoteSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
