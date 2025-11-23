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

export async function POST(req) {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    
    // Parse request body
    const body = await req.json();
    const { student_id, counselor_id, message, sender, date, documentUrl, documentName } = body;
    
    // Validate required fields
    if (!student_id) {
      return NextResponse.json(
        { error: "student_id is required" },
        { status: 400 }
      );
    }
    
    if (!message || !sender) {
      return NextResponse.json(
        { error: "message and sender are required" },
        { status: 400 }
      );
    }
    
    // Build the message object
    const newMessage = {
      message,
      sender,
      date: date || new Date(),
      ...(documentUrl && { documentUrl }),
      ...(documentName && { documentName }),
    };
    
    // Build query to find existing followup
    const query = { student_id };
    if (counselor_id) {
      query.counselor_id = counselor_id;
    }
    
    // Find existing followup document
    const existingFollowup = await db.collection("followups").findOne(query);
    
    if (existingFollowup) {
      // Update existing followup - add message to messages array
      await db.collection("followups").updateOne(
        { _id: existingFollowup._id },
        {
          $push: { messages: newMessage },
          $set: { updatedAt: new Date() }
        }
      );
    } else {
      // Create new followup document
      await db.collection("followups").insertOne({
        student_id,
        counselor_id: counselor_id || null,
        messages: [newMessage],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    return NextResponse.json({
      success: true,
      message: "Message added successfully",
      data: newMessage,
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error adding message:", error);
    return NextResponse.json(
      {
        error: "Failed to add message",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

