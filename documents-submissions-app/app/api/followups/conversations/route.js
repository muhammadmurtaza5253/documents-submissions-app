import clientPromise from "@/lib/mongodb";
import { DATABASE_NAME } from "@/app/utils/commonConstants";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    
    // Get query parameters
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("student_id");
    const counselorId = searchParams.get("counselor_id");
    
    // Build query filter
    const query = {};
    if (studentId) {
      query.student_id = studentId;
    }
    if (counselorId) {
      query.counselor_id = counselorId;
    }
    
    // Fetch followups documents
    const followups = await db.collection("followups").find(query).toArray();

    const messages = followups.flatMap((followUp) => {
      return followUp.messages;
    })
    
    return NextResponse.json({
      success: true,
      messages: messages || [],
      count: messages?.length || 0,
    });
    
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch messages",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

