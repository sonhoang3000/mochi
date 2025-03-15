import axios from "../axios"

const registerUser = (input) => {
	return axios.post("/api/v1/user/register",
		{
			username: input.username,
			email: input.email,
			password: input.password
		},
		{
			withCredentials: true // Thêm cấu hình này
		})
}

const loginUser = (input) => {
	return axios.post("/api/v1/user/login",
		{
			email: input.email,
			password: input.password
		},
		{
			withCredentials: true // Thêm cấu hình này
		}
	)
}

const logoutUser = () => {
	return axios.get("/api/v1/user/logout", { withCredentials: true })
}

const getSuggestedUsers = () => {
	return axios.get("/api/v1/user/suggested", { withCredentials: true })
}

const getProfile = (userId) => {
	return axios.get(`/api/v1/user/${userId}/profile`, { withCredentials: true })
}

const editProfile = (formData) => {
	return axios.post(`/api/v1/user/profile/edit`, formData, { withCredentials: true })
}

const followOrUnfollow = (userProfileId, currentUserId) => {
	return axios.post(`/api/v1/user/followorunfollow/${userProfileId}`, currentUserId, { withCredentials: true })
}

const searchUser = (username, lastId = null) => {
	let url = `/api/v1/user/search/${username}`;
	if (lastId) {
		url += `?lastId=${lastId}`;
	}
	return axios.get(url, { withCredentials: true })
}

const getConversationService = () => {
	return axios.get("/api/v1/user/getconversation", { withCredentials: true })
}

const createConversationService = (targetId) => {
	console.log('check ', targetId)
	return axios.get(
		`/api/v1/user/createconversation/${targetId}`,
		// {}, // Phải có body (nếu không gửi gì, truyền `{}`)
		{ withCredentials: true } // Cấu hình phải nằm trong object thứ 3
	)
}

export {
	registerUser, loginUser, logoutUser, getSuggestedUsers, getProfile, editProfile, followOrUnfollow,
	searchUser, getConversationService, createConversationService
}