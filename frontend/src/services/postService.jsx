import axios from "../axios"

const addNewPost = (formData) => {
	return axios.post("/api/v1/post/addpost",
		formData,
		{ withCredentials: true }
	)
}

const getAllPost = () => {
	return axios.get("/api/v1/post/all", { withCredentials: true })
}

const deletePost = (postId) => {
	return axios.delete(`/api/v1/post/delete/${postId}`, { withCredentials: true })
}

const likeOrDislike = (postId, action) => {
	return axios.get(`/api/v1/post/${postId}/${action}`, { withCredentials: true })
}

const addComment = (postId, text) => {
	return axios.post(`/api/v1/post/${postId}/comment`, text, { withCredentials: true })
}

const bookmarkPost = (postId) => {
	return axios.get(`/api/v1/post/${postId}/bookmark`, { withCredentials: true })
}

export {
	addNewPost, getAllPost, deletePost, likeOrDislike, addComment, bookmarkPost
}