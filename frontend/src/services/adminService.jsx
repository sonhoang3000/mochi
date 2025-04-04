import axios from "../axios"

const deleteUserService = (userId) => {
      return axios.delete(`/admin/delete/user/${userId}`, { withCredentials: true })
}

const deletePostService = (postId) => {
<<<<<<< HEAD
      console.log('check postId', postId)
=======
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
      return axios.delete(`/admin/delete/post/${postId}`, { withCredentials: true })
}

export {
      deleteUserService, deletePostService
}