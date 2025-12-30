export const fetchAgenda = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
                params.append(key, filters[key]);
            }
        });

        let response;
        try {
            response = await fetch(`/api/agenda?${params.toString()}`);
        } catch (e) {
            console.warn("Proxy request failed, trying direct...", e);
            response = await fetch(`http://127.0.0.1:8000/agenda?${params.toString()}`);
        }

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch agenda:", error);
        throw error;
    }
};

export const fetchAvailableDates = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        Object.keys(filters).forEach(key => {
            if (filters[key]) params.append(key, filters[key]);
        });

        let response;
        try {
            response = await fetch(`/api/agenda/dates?${params.toString()}`);
        } catch (e) {
            response = await fetch(`http://127.0.0.1:8000/agenda/dates?${params.toString()}`);
        }

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch dates:", error);
        throw error;
    }
};

export const fetchGovernment = async () => {
    try {
        const response = await fetch('/api/government');
        if (!response.ok) throw new Error('Failed to fetch government composition');
        return await response.json();
    } catch (error) {
        // Fallback for direct backend access
        const response = await fetch('http://127.0.0.1:8000/government');
        return await response.json();
    }
};

export const fetchBio = async (url) => {
    try {
        const params = new URLSearchParams({ url });
        const response = await fetch(`/api/government/bio?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch bio');
        return await response.json();
    } catch (error) {
        const params = new URLSearchParams({ url });
        const response = await fetch(`http://127.0.0.1:8000/government/bio?${params.toString()}`);
        return await response.json();
    }
};
// Participation Resources
export const fetchResources = async () => {
    try {
        const response = await fetch('/api/participation/resources');
        if (!response.ok) throw new Error('Failed to fetch resources');
        return await response.json();
    } catch (e) {
        const response = await fetch('http://127.0.0.1:8000/participation/resources');
        return await response.json();
    }
};

export const fetchResource = async (slug) => {
    try {
        const response = await fetch(`/api/participation/resources/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch resource');
        return await response.json();
    } catch (e) {
        const response = await fetch(`http://127.0.0.1:8000/participation/resources/${slug}`);
        return await response.json();
    }
};

export const createResource = async (resource, token) => {
    const response = await fetch('/api/participation/resources', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resource)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to create resource');
    }
    return await response.json();
};

export const updateResource = async (id, resource, token) => {
    const response = await fetch(`/api/participation/resources/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resource)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to update resource');
    }
    return await response.json();
};

export const deleteResource = async (id, token) => {
    const response = await fetch(`/api/participation/resources/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to delete resource');
    }
    return await response.json();
};
