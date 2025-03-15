import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const PostItem = ({ post }) => {
  return (
    <View style={styles.postContainer}>
      <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      <Text style={styles.username}>{post.username}</Text>
      <Text style={styles.caption}>{post.caption}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  username: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  caption: {
    marginTop: 3,
    color: '#555',
  },
});

export default PostItem;
