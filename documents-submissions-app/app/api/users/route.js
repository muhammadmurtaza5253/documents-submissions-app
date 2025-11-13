import clientPromise from "@/lib/mongodb";

const DATABASE_NAME = "docbase";
const STUDENTS = "students";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const users = await db.collection(STUDENTS).find({}).toArray();
    return Response.json(users);
  } catch (e) {
    console.error("Error fetching users:", e);
    return Response.json(
      { error: "Failed to fetch users", details: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const data = await request.json();
    const result = await db.collection(STUDENTS).insertOne(data);
    return Response.json(result);
  } catch (e) {
    console.error("Error creating user:", e);
    return Response.json(
      { error: "Failed to create user", details: e instanceof Error ? e.message : "Unknown error" },
      { status: 500 }
    );
  }
}
