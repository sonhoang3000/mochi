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

export {
	registerUser, loginUser, logoutUser
}