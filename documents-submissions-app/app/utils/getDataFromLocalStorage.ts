export const getDataFromLocalStorage = (key: string) => {
    try {
        if (window.localStorage) {
            const user = JSON.parse(window.localStorage.getItem("user") || "{}");
            return user[key];
        }
        return null;
    } catch (e) {
        return null;
    }
};