import axios from "../axios"

const getAllNotificationsService = () => {
	return axios.get("/api/v1/notification/getnoti", { withCredentials: true })
}

const markAsRead = (notificationId) => {
<<<<<<< HEAD
	console.log("Marking notification as read:", notificationId);
	return axios.put(`/api/v1/notification/${notificationId}/read`, {}, { withCredentials: true });

=======
	return axios.put(`/api/v1/notification/${notificationId}/read`, {}, { withCredentials: true });
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
}

export { getAllNotificationsService, markAsRead }
