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

export {
	registerUser, loginUser, logoutUser, getSuggestedUsers, getProfile, editProfile
}