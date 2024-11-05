import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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
    enum: ['admin', 'interpreter'],
    default: 'interpreter',
  },
  public_uuid: {
    type: String,
    unique: true,
  },
  private_id: {
    type: String,
    unique: true,
    required: true, // Make sure this is defined
  },
  // Add other fields as necessary
});

// Export the model, ensuring it doesn't duplicate
export default mongoose.models.User || mongoose.model('User', UserSchema);
