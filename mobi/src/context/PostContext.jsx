import React, { createContext, useState } from 'react';

export const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const addNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <PostContext.Provider value={{ posts, setPosts, addNewPost }}>
      {children}
    </PostContext.Provider>
  );
};
