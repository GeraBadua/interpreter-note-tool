// models/Team.js

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const TeamSchema = new mongoose.Schema({
  team_id: {
    type: String,
    default: uuidv4, // Generate a unique team ID
    unique: true,
  },
  admin_private_id: {
    type: String,
    required: true, // Links to the admin's private ID
  },
  admin_public_uuid: {
    type: String,
    required: true, // Links to the admin's public UUID, used by interpreters to send join requests
  },
  team_name: {
    type: String,
    default: 'New Team', // Can be customized later
  },
  members: [
    {
      type: String, // Store the public UUID of each member
      required: true,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
