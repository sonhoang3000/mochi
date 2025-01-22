import axios from "../axios"

const sendMessage = (receiverId, textMessage) => {
      return axios.post(`/api/v1/message/send/${receiverId}`, textMessage, { withCredentials: true })
}

const getMessage = (id) => {
      return axios.get(`/api/v1/message/all/${id}`, { withCredentials: true })
}

export {
      sendMessage, getMessage
}