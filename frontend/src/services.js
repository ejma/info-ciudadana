export const fetchAgenda = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });

        const response = await fetch(`/api/agenda?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch agenda:", error);
        return [];
    }
};
