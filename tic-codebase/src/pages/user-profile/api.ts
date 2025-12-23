import api from '../../services/api';

export async function fetchUserProfile() {
    const response = await api.get('/profile');
    return response.data;
}

export async function updateUserProfile(data: any) {
    // If there is a file, use FormData
    if (data.cvFile) {
        // Map camelCase keys to backend snake_case keys
        const keyMap: Record<string, string> = {
            firstName: "firstName",
            lastName: "lastName",
            secondNationality: "secondNationality",
            hearFrom: "hearFrom",
            cvFile: "cvFile",
            ageGroup: "ageGroup",
            job_alerts: "job_alerts",
            available_date: "available_date",
            roles: "roles",
            subjects: "subjects",
            leadershipRoles: "leadershipRoles",
            // Add more mappings as needed
        };
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                const backendKey = keyMap[key] || key;
                // Arrays: append each value as separate entry
                if (Array.isArray(value)) {
                    value.forEach((v) => {
                        if (v && typeof v === 'object' && v.value !== undefined) {
                            formData.append(backendKey, v.value);
                        } else {
                            formData.append(backendKey, v);
                        }
                    });
                } else if (value instanceof Blob) {
                    formData.append(backendKey, value);
                } else {
                    formData.append(backendKey, String(value));
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
