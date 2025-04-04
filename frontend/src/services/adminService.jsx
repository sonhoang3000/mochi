import axios from "../axios"

const deleteUserService = (userId) => {
      return axios.delete(`/admin/delete/user/${userId}`, { withCredentials: true })
}

const deletePostService = (postId) => {
      console.log('check postId', postId)
      return axios.delete(`/admin/delete/post/${postId}`, { withCredentials: true })
}

export { deletePostService, deleteUserService }

