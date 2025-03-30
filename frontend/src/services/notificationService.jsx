import axios from "../axios"

const getAllNotificationsService = () => {
	return axios.get("/api/v1/notification/getnoti", { withCredentials: true })
}

const markAsRead = (notificationId) => {
	return axios.put(`/api/v1/notification/${notificationId}/read`, {}, { withCredentials: true });
}

export { getAllNotificationsService, markAsRead }
