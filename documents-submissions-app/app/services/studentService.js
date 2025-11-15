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

export const fetchExistingFormData = async () => {
  try {
    // Get user ID from localStorage
    const userId = getUserId();
    
    if (!userId) {
      return { 
        error: true, 
        data: null,
        message: "User ID not found. Please log in again." 
      };
    }
    
    // Fetch existing form data
    const response = await fetch(`/api/academicform?userId=${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { 
        error: true, 
        data: null,
        message: errorData.error || "Failed to fetch form data" 
      };
    }
    
    const result = await response.json();
    return { 
      error: false, 
      data: result.data || null,
      message: "Form data fetched successfully" 
    };
  } catch (e) {
    console.error("Error fetching existing form data: ", e);
    return { 
      error: true, 
      data: null,
      message: "Failed to fetch form data" 
    };
  }
};
