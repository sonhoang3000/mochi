import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { getFollowing, followOrUnfollowUser } from "../api/api"; 

const FollowingScreen = ({ route }) => {
  const { userId } = route.params;
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      const response = await getFollowing(userId);
      setFollowing(response.following);
    } catch (error) {
      console.error("Error fetching following:", error);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      await followOrUnfollowUser(targetUserId);
      setFollowing(following.filter(user => user._id !== targetUserId));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };

  const renderItem = ({ item }) => (
      <View style={styles.userItem}>
          <Image
        source={
          item.profilePicture
            ? { uri: item.profilePicture }
            : require("../assets/R.jpg")
        }
        style={styles.avatar}
      />

      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => handleUnfollow(item._id)} style={styles.unfollowButton}>
        <Text style={styles.buttonText}>Unfollow</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đang theo dõi</Text>
      <FlatList
        data={following}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = {
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  userItem: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd" },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  userInfo: { flex: 1, justifyContent: "center" },
  username: { fontSize: 16, fontWeight: "bold" },
  email: { fontSize: 14, color: "gray" },
  unfollowButton: { backgroundColor: "red", paddingVertical: 5, paddingHorizontal: 15, borderRadius: 5 },
  buttonText: { color: "white", fontWeight: "bold" },
};

export default FollowingScreen;
