import api from '../../services/api';

export async function fetchUserProfile() {
    const response = await api.get('/user/profile');
    return response.data;
}

export async function updateUserProfile(data: any) {
    const response = await api.put('/user/profile', data);
    return response.data;
}
