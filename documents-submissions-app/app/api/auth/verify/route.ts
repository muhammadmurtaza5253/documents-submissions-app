import { NextRequest, NextResponse } from "next/server";
// @ts-expect-error - mongodb.js is a JavaScript file
import clientPromise from "@/lib/mongodb";
import { DATABASE_NAME, STUDENTS } from "@/app/utils/commonConstants";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "No token provided" },
        { status: 401 }
      );
    }

    // Decode token (in production, verify JWT signature)
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [username] = decoded.split(":");

    if (!username) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // @ts-expect-error - clientPromise type is from JS file
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    
    // Find user by username
    const user = await db.collection(STUDENTS).findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

