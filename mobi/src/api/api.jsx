import axios from 'axios';
const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const login = async (email, password) => {
  return api.post('/user/login', { email, password });
};

export const register = async (username, email, password) => {
  console.log("Sending register request:", { username, email, password });

  try {
    const response = await api.post('/user/register', { username, email, password });
    console.log("Register success:", response.data);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getUserProfile = async (userId) => {
  return api.get(`/user/${userId}/profile`);
};

export const addPost = async (file, caption) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('caption', caption);
  return api.post('/post/addpost', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getAllPosts = async () => {
  return api.get('/post/all');
};
export const likePost = async (postId) => {
  return api.get(`/post/${postId}/like`);
};

export const dislikePost = async (postId) => {
  return api.get(`/post/${postId}/dislike`);
};

export const bookmarkPost = async (postId) => {
  return api.get(`/post/${postId}/bookmark`);
};

export const addComment = async (postId, comment) => {
  return api.post(`/post/${postId}/comment`, { text: comment });
};


export const getUserPosts = () => {
  return api.get('/post/userpost/all');
};

export const getBookmarkedPosts = async () => {
  return api.get('/post/userpost/bookmarked');
};

export const editProfile = async (formData) => {
  return api.post('/user/profile/edit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => res.data);
};

export const deletePost = async (postId, token) => {
  try {
    const response = await api.delete(`/post/delete/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Delete post error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getAllCommentsOfPost = async (postId) => {
  return api.post(`/post/${postId}/comment/all`);
};

export const getSuggestedUsers = async () => {
  try {
    const response = await api.get('/user/suggested');
    const users = response.data?.users || [];
    return users;
  } catch (error) {
    console.error('API getSuggestedUsers error:', error.response?.data || error.message);
    return [];
  }
};

export const followOrUnfollow = async (targetUserId, currentUserId) => {
  try {
    const response = await api.post(`/user/followorunfollow/${targetUserId}`, currentUserId, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Follow/Unfollow error:", error.response?.data || error.message);
    throw error;
  }
};

export const getFollowing = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}/following`);
    return response.data;
  } catch (error) {
    console.error("API getFollowing error:", error.response?.data || error.message);
    throw error;
  }
};

export const getFollowers = async (userId) => {
  try {
    const response = await api.get(`/user/${userId}/followers`);
    return response.data;
  } catch (error) {
    console.error("API getFollowers error:", error.response?.data || error.message);
    throw error;
  }
};

export const getAllMessages = async (userId) => {
  try {
    const response = await api.get(`/message/all/${userId}`);
    return response.data;
  } catch (error) {
    console.error(" Lỗi khi gọi API getAllMessages:", error);
    return { messages: [], success: false };
  }
};

<<<<<<< HEAD
export const sendMessage = async (receiverId, data) => {
  try {
    const res = await api.post(`/message/send/${receiverId}`, data);
    return res.data;
=======
export const sendMessage = async (receiverId, textMessage) => {
  try {
    return await api.post(`/message/send/${receiverId}`, textMessage);
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
  } catch (error) {
    console.error(" Lỗi khi gửi tin nhắn:", error.response?.data || error.message);
    return { success: false };
  }
};

export const getConversationService = async () => {
  try {
    const res = await api.get("/user/getconversation")
    return res.data;
  } catch (error) {
    console.error(" Lỗi khi gửi tin nhắn:", error.response?.data || error.message);
    return { success: false };
  }
};
