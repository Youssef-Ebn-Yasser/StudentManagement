import axios from 'axios';

const API_URL = 'https://e-learn-v1.runasp.net/api/Gemini';

export const chatbotService = {
    sendMessage: async (prompt) => {
        try {
            const response = await axios.post(`${API_URL}/chatboot`, {
                prompt: prompt
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}; 