import { NextRequest, NextResponse } from "next/server";
// @ts-expect-error - mongodb.js is a JavaScript file
import clientPromise from "@/lib/mongodb";
import { DATABASE_NAME, STUDENTS } from "@/app/utils/commonConstants";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // @ts-expect-error - clientPromise type is from JS file
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    
    // Find user by username
    const user = await db.collection(STUDENTS).findOne({ username });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // In a real app, you should hash passwords and compare hashes
    // For now, we'll do a simple comparison (NOT SECURE - just for demo)
    // TODO: Implement proper password hashing (bcrypt, etc.)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Generate a simple token (in production, use JWT or similar)
    // const token = Buffer.from(`${username}:${Date.now()}`).toString("base64");

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zip: user.zip,
        country: user.country,
        role: user.role,
      },
    });

    response.cookies.set("userLoggedIn", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });
    
    // TODO: Implement proper authentication token management
    // Set auth token as HTTP-only cookie
    // response.cookies.set("auth-token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 60 * 60 * 24 * 7, // 7 days
    //   path: "/",
    // });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

