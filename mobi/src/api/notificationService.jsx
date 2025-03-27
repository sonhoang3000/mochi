import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';

export const api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
});

const getAllNotificationsService = () => {
	return api.get("/notification/getnoti", { withCredentials: true })
}

const markAsRead = (notificationId) => {
	console.log("Marking notification as read:", notificationId);
	return api.put(`/notification/${notificationId}/read`, {}, { withCredentials: true });
}

export { getAllNotificationsService, markAsRead }
