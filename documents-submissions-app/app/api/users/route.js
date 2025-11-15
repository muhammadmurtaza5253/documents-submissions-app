import clientPromise from "@/lib/mongodb";
import { DATABASE_NAME, STUDENTS } from "@/app/utils/commonConstants";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const users = await db.collection(STUDENTS).find({}).toArray();
    return Response.json(users);
  } catch (e) {
    console.error("Error fetching users:", e);
    return Response.json(
      {
        error: "Failed to fetch users",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const data = await request.json();
    const { username, password, name } = data;

    if (!username || !password || !name) {
      return Response.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUser = await db
      .collection(STUDENTS)
      .findOne({ username: data.username });

    if (existingUser) {
      return Response.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    // Insert new user
    const result = await db.collection(STUDENTS).insertOne({
      name: data.name || "",
      username: data.username,
      password: data.password, 
    });

    return Response.json(
      { success: true, id: result.insertedId },
      { status: 201 }
    );
  } catch (e) {
    console.error("Error creating user:", e);
    return Response.json(
      {
        error: "Failed to create user",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
