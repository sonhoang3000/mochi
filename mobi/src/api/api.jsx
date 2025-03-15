import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    return response.data.users; 
  } catch (error) {
    console.error('API getSuggestedUsers error:', error.response?.data || error.message);
    throw error;
  }
};

// export const followOrUnfollowUser = async (targetUserId) => {
//   try {
//     const response = await api.post(`/followorunfollow/${targetUserId}`);
//     return response.data;
//   } catch (error) {
//     console.error("Follow/Unfollow error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// export const followOrUnfollowUser = (userProfileId, currentUserId) => {
// 	return axios.post(`/user/followorunfollow/${userProfileId}`, currentUserId, { withCredentials: true })
// }
export const followOrUnfollowUser = async (targetUserId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/followorunfollow/${targetUserId}`,
      {}, // Nếu API yêu cầu body, hãy thêm dữ liệu vào đây
      { withCredentials: true }
    );
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


// Gửi tin nhắn
export const sendMessage = async (senderId, receiverId, message) => {
  try {
    const response = await api.post('/messages/send', { senderId, receiverId, message });
    return response.data;
  } catch (error) {
    console.error('Send message error:', error.response?.data || error.message);
    throw error;
  }
};

// Lấy tin nhắn giữa hai người dùng
export const getMessages = async (userId1, userId2) => {
  try {
    const response = await api.get(`/messages/${userId1}/${userId2}`);
    return response.data;
  } catch (error) {
    console.error('Get messages error:', error.response?.data || error.message);
    throw error;
  }
};

// Lắng nghe tin nhắn mới
export const listenForMessages = (callback) => {
  socket.on('newMessage', (message) => {
    callback(message);
  });
};

// Ngắt kết nối socket khi không dùng nữa
export const disconnectSocket = () => {
  socket.disconnect();
};
