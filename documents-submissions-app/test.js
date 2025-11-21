const date = new Date();


// Format date to YYYY-MM-DD
export const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

console.log(formatDateKey(date));