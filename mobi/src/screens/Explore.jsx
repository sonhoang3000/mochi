import React, { useState, useEffect } from 'react';
import { View, FlatList, Image, ActivityIndicator, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { getAllPosts } from '../api/api'; // Ensure the path is correct
import { useNavigation } from '@react-navigation/native';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getAllPosts();
        setPosts(response.data.posts); // Use response.data.posts to get the list of posts
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const numColumns = 3;
  const imageSize = Dimensions.get('window').width / numColumns - 2; // Adjust for margin

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { post: item })}>
            <Image source={{ uri: item.src }} style={[styles.image, { width: imageSize, height: imageSize }]} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    margin: 1,
    backgroundColor: '#e1e4e8', // Placeholder color while loading
  },
});

export default Explore;