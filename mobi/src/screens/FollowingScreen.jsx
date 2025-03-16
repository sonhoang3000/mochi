import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getFollowing, followOrUnfollowUser } from "../api/api";
import Toast from "react-native-toast-message";

const FollowingScreen = ({ route }) => {
  const { userId } = route.params;
  const [following, setFollowing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unfollowingUserId, setUnfollowingUserId] = useState(null);

  useEffect(() => {
    fetchFollowing();
  }, []);

  const fetchFollowing = async () => {
    try {
      const response = await getFollowing(userId);
      setFollowing(response.following);
    } catch (error) {
      console.error("Error fetching following:", error);
      Toast.show({ type: "error", text1: "Failed to load following list" });
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (targetUserId) => {
    try {
      setUnfollowingUserId(targetUserId);
      await followOrUnfollowUser(targetUserId);
      setFollowing((prev) => prev.filter((user) => user._id !== targetUserId));
      Toast.show({ type: "success", text1: "Unfollowed successfully" });
    } catch (error) {
      console.error("Error unfollowing user:", error);
      Toast.show({ type: "error", text1: "Unfollow failed" });
    } finally {
      setUnfollowingUserId(null);
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
      <TouchableOpacity
        onPress={() => handleUnfollow(item._id)}
        style={styles.unfollowButton}
        disabled={unfollowingUserId === item._id}
      >
        {unfollowingUserId === item._id ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Unfollow</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Đang theo dõi</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0095F6" />
      ) : following.length === 0 ? (
        <Text style={styles.emptyText}>Bạn chưa theo dõi ai.</Text>
      ) : (
        <FlatList
          data={following}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  userInfo: { flex: 1 },
  username: { fontSize: 16, fontWeight: "600" },
  email: { fontSize: 14, color: "#555" },
  unfollowButton: {
    backgroundColor: "#FF4D4F",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 14 },
  emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
});

export default FollowingScreen;
