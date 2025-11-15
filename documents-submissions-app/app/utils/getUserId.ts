export const getUserId = () => {
  try {
    if (window.localStorage) {
      const user = JSON.parse(window.localStorage.getItem("user") || "{}");
      return user.id;
    }
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
  return null;
};
