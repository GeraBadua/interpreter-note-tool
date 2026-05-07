import connect, { isDemoMode } from '@/lib/dbConnection';
import User from '@/models/User';
import Team from '@/models/Team';
import bcrypt from 'bcryptjs';

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

    if (isDemoMode()) {
      return new Response(
        JSON.stringify({ message: 'Demo mode: registration is disabled. Use the demo accounts in the README.' }),
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'Email already exists' }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new admin user
    const newUser = new User({
      username,
      email,
      password_hash: hashedPassword,
      role: 'Admin',
    });

    await newUser.save();

    // Create new team associated with the admin
    const newTeam = new Team({
      admin_email: email,
      team_name: `${username}'s Team`,
    });

    await newTeam.save();

    return new Response(
      JSON.stringify({ message: 'Admin registered successfully'}),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
  }
}
