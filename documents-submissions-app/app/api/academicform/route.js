import clientPromise from "@/lib/mongodb";
import { DATABASE_NAME, STUDENTS } from "@/app/utils/commonConstants";
import { ObjectId } from "mongodb";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    
    // Get user ID from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    // Validate user ID exists
    if (!userId) {
      return Response.json(
        { error: "User ID is required." },
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
    
    // Find the student document
    const user = await db.collection(STUDENTS).findOne({ _id: userObjectId });
    
    if (!user) {
      return Response.json(
        { error: "User not found." },
        { status: 404 }
      );
    }
    
    // Extract form fields (exclude internal MongoDB fields and sensitive data)
    const formData = {
      email: user.email || "",
      phone: user.phone || "",
      city: user.city || "",
      educationLevel: user.educationLevel || "",
      institution: user.institution || "",
      fieldOfStudy: user.fieldOfStudy || "",
      purpose: user.purpose || "",
      careerInterest: user.careerInterest || "",
      country: user.country || "",
      language: user.language || "",
      description: user.description || "",
    };
    
    return Response.json(
      { success: true, data: formData },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error fetching academic form data:", e);
    return Response.json(
      {
        error: "Failed to fetch academic counselling form data",
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
