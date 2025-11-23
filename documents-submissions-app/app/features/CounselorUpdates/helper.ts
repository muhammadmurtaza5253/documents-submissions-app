// Format date to YYYY-MM-DD
export const formatDateKey = (date: Date | string): string => {
  return new Date(date).toISOString().split("T")[0];
};
