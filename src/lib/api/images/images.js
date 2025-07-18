import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

const api = axios.create({
    baseURL: 'https://api.imgbb.com',
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

const apiKey = '398dda55e0b176a84ccf88f2310d8417';

export async function uploadImage(file) {
    try {
        const base64Data = file;
        const formData = new FormData();
        formData.append('image', base64Data);
        const response = await api.post('/1/upload', formData, { params: { key: apiKey } });
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error.response?.data?.error?.message || error.message);
        return null;
    }
}

export async function uploadImages(files, id) {
    const uploadedUrls = [];
    for (const file of files) {
        const imageUrl = await uploadImage(file);
        if (imageUrl) {
            uploadedUrls.push(imageUrl);
            try {
                const values = { img_empresa: imageUrl.data.display_url };
                await axios.put(`${API_BASE_URL}/empresas/${id}`, { ...values });
            } catch (error) {
                console.error('Error sending image URL:', error.response?.data?.error?.message || error.message);
            }
        }
    }
    return uploadedUrls;
}
