import api from '../../services/api';

export async function fetchUserProfile() {
    const response = await api.get('/profile');
    return response.data;
}

export async function updateUserProfile(data: any) {
    // If there is a file, use FormData
    if (data.cvFile) {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                // For arrays (like curriculum), append as JSON string
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else if (value instanceof Blob || typeof value === 'string') {
                    formData.append(key, value);
                } else {
                    formData.append(key, JSON.stringify(value));
                }
            }
        });
        const response = await api.put('/profile/update', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    } else {
        // No file, send as JSON
        const response = await api.put('/profile/update', data);
        return response.data;
    }
}
