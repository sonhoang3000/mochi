import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const StoryItem = ({ story }) => {
  return (
    <TouchableOpacity style={styles.storyContainer}>
      <Image source={{ uri: story.user.profilePicture }} style={styles.storyImage} />
      <Text style={styles.username}>{story.user.username}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#ff4500',
  },
  username: {
    fontSize: 12,
    marginTop: 5,
  },
});

export default StoryItem;
