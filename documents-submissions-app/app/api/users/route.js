import clientPromise from "@/lib/mongodb";

const DATABASE_NAME = 'docbase';
const STUDENTS = 'students';

export async function GET() {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const users = await db.collection(STUDENTS).find({}).toArray();
    return Response.json(users);
}

export async function POST(request) {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const data = await request.json();
    const result = await db.collection(STUDENTS).insertOne(data);
    return Response.json(result);
}