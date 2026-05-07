// routes/adminteam/route.js

import connect, { isDemoMode } from '@/lib/dbConnection';
import Team from '@/models/Team';
import User from '@/models/User';

export async function POST(req) {
  try {
    await connect();

    if (isDemoMode()) {
      return new Response(JSON.stringify({ message: 'Demo mode: team updates are disabled.' }), { status: 400 });
    }

    const body = await req.json();
    const { adminPrivateId, interpreterPublicUuid } = body;

    // Check if the admin team exists
    const team = await Team.findOne({ admin_private_id: adminPrivateId });
    if (!team) {
      return new Response(JSON.stringify({ message: 'Admin team not found.' }), { status: 404 });
    }

    // Check if the interpreter exists
    const interpreter = await User.findOne({ public_uuid: interpreterPublicUuid });
    if (!interpreter) {
      return new Response(JSON.stringify({ message: 'Interpreter not found.' }), { status: 404 });
    }

    // Add the interpreter to the team's members array
    team.members.push(interpreterPublicUuid);
    await team.save();

    return new Response(JSON.stringify({ message: 'Interpreter added to the team successfully.' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Something went wrong.' }), { status: 500 });
  }
}
