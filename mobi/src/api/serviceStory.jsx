import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8000/api/v1';

export const api = axios.create({
      baseURL: API_BASE_URL,
      withCredentials: true,
});

export const addStory = (file, caption) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      return api.post('/story/create', formData, {
            headers: {
                  'Content-Type': 'multipart/form-data',
            },
      });
};

export const getUserStory = () => {
      return api.get(`/story/getuserstory`);
}

export const deleteStory = (id) => {
      return api.delete(`/story/delete/${id}`);
}

export const getFollowStories = () => {
      return api.get('/story/follow');
}

export const likeOrDislikeStory = (id) => {
      return api.put(`/story/${id}/likeordislike`);
}

export const commentOnStory = (id, text) => {
      return api.post(`/story/comment/${id}`, { text });
}

export const getStoryComments = (id) => {
      return api.get(`/story/${id}/getcomments`);
}