// api/adminreg/route.js

import connect from '@/lib/dbConnection';
import User from '@/models/User';
import Team from '@/models/Team';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    await connect();

    const body = await req.json();
    const { username, email, password } = body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const validatePassword = (password) => {
      return passwordRegex.test(password);
    };

    if (!validatePassword(password)) {
      return new Response(
        JSON.stringify({
          message: 'Password must be at least 8 characters long, and include uppercase letters, lowercase letters, numbers, and special characters.',
        }),
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate only the public UUID
    const publicUUID = uuidv4();

    // Create new admin user
    const newUser = new User({
      public_uuid: publicUUID,
      username,
      email,
      password_hash: hashedPassword,
      role: 'Admin',
    });

    await newUser.save();

    // Create new team associated with the admin
    const newTeam = new Team({
      admin_public_uuid: publicUUID,
      team_name: `${username}'s Team`,
    });

    await newTeam.save();

    return new Response(
      JSON.stringify({ message: 'Admin registered successfully', publicUUID }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
