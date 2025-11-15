import { getUserId } from "@/app/utils/getUserId";

export const submitPersonalStudentData = async (data) => {
  try {
    // Get user ID from localStorage
    const userId = getUserId();
    
    if (!userId) {
      return { 
        error: true, 
        resp: new Response(
          JSON.stringify({ error: "User ID not found. Please log in again." }),
          { status: 400 }
        )
      };
    }
    
    // Include user ID in the request
    const response = await fetch("/api/academicform", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        userId: userId,
      }),
    });
    return { resp: response };
  } catch (e) {
    console.error("Error submitting student data: ", e);
    return { error: true };
  }
};
