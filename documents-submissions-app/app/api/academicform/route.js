import clientPromise from "@/lib/mongodb";
import { DATABASE_NAME, STUDENTS } from "@/app/utils/commonConstants";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const data = await request.json();
    
    // Get user ID from request body
    const { userId, ...formData } = data;
    
    // Validate user ID exists
    if (!userId) {
      return Response.json(
        { error: "User ID is required. Please log in again." },
        { status: 400 }
      );
    }
    
    // Validate user ID format
    let userObjectId;
    try {
      userObjectId = new ObjectId(userId);
    } catch {
      return Response.json(
        { error: "Invalid user ID format." },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await db.collection(STUDENTS).findOne({ _id: userObjectId });
    
    if (!user) {
      return Response.json(
        { error: "User not found." },
        { status: 404 }
      );
    }
    
    // Update the student document with academic form data
    const result = await db.collection(STUDENTS).updateOne(
      { _id: userObjectId },
      { 
        $set: { 
          ...formData,
          updatedAt: new Date()
        } 
      }
    );
    
    if (result.matchedCount === 0) {
      return Response.json(
        { error: "Failed to update student data." },
        { status: 500 }
      );
    }
    
    return Response.json(
      { success: true, message: "Academic counselling form submitted successfully" },
      { status: 200 }
    );
  }
  catch (e) {
    console.error("Error submitting academic form:", e);
    return Response.json(
      {
        error: "Failed to submit academic counselling form",
        details: e instanceof Error ? e.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
