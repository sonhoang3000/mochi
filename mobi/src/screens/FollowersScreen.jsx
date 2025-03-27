import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from "react-native";
import { getFollowers, followOrUnfollowUser } from "../api/api";

const FollowersScreen = ({ route }) => {
  const { userId } = route.params;
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    fetchFollowers();
  }, []);

  const fetchFollowers = async () => {
    try {
      const response = await getFollowers(userId);
      setFollowers(response.followers);
    } catch (error) {
      console.error("Error fetching followers:", error);
    }
  };

  const handleFollow = async (targetUserId) => {
    try {
      await followOrUnfollowUser(targetUserId);
      setFollowers(prevFollowers =>
        prevFollowers.map(user =>
          user._id === targetUserId ? { ...user, isFollowing: !user.isFollowing } : user
        )
      );
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Image source={{ uri: item.profilePicture || "https://via.placeholder.com/50" }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleFollow(item._id)}
        style={[styles.followButton, item.isFollowing ? styles.unfollow : styles.follow]}>
        <Text style={styles.buttonText}>{item.isFollowing ? "Following" : "Follow"}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Người theo dõi</Text>
      <FlatList
        data={followers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff69b4",
    marginBottom: 10,
    textAlign: "center",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  follow: {
    backgroundColor: "#ff69b4", // màu hồng đậm
  },
  unfollow: {
    backgroundColor: "#ffc0cb", // màu hồng nhạt
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FollowersScreen;
