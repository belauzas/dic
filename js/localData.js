/**
 * Wrapper class/methods for localStorage API.
 */
class localData {
    /**
     * Get JSON from localStorage
     * @param key Local Storage key
     * @returns Local Storage value
     */
    static getJSON(key) {
        const dataJSON = localStorage.getItem(key);
        if (dataJSON) {
            try {
                return [false, JSON.parse(dataJSON)];
            }
            catch (error) {
                return [true, 'Nevalidi informacija'];
            }
        }
        return [true, 'Nera informacijos'];
    }
    /**
     * Set JSON to localStorage
     * @param key Local Storage key
     * @param data Data/content
     * @returns `True/false`: was it successful
     */
    static setJSON(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}
export { localData };
//# sourceMappingURL=localData.js.map