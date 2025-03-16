import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, Image, FlatList, TouchableOpacity, StyleSheet,
  Dimensions, Alert, RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../context/AuthContext';
import { getUserProfile, getUserPosts } from '../api/api';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const screenWidth = Dimensions.get('window').width;

const ProfileScreen = ({ route, navigation }) => {
  const { user, userId, isLoading, logout } = useContext(AuthContext);
  const currentUserId = route.params?.userId || userId;

  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  useEffect(() => {
    if (isLoading) return;
    if (!currentUserId || currentUserId === "null") {
      Alert.alert("Chưa đăng nhập", "Vui lòng đăng nhập để xem profile.");
      navigation.navigate("Login");
      return;
    }
    fetchProfileData();
  }, [currentUserId, isLoading]);

  const fetchProfileData = async () => {
    try {
      const profileRes = await getUserProfile(currentUserId);
      if (profileRes.data?.success) {
        setProfileData(profileRes.data.user);
      }
      const postsRes = await getUserPosts(currentUserId);
      if (postsRes.data?.success) {
        setPosts(postsRes.data.posts);
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tải dữ liệu.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfileData();
    setRefreshing(false);
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity style={styles.postItem}>
      <Image source={{ uri: item.src }} style={styles.postImage} />
    </TouchableOpacity>
  );

  const renderContent = () => {
    const savedPosts = profileData?.bookmarks || [];
    if (activeTab === "posts") {
      return (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={renderPostItem}
          numColumns={3}
          contentContainerStyle={styles.postsContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      );
    } else if (activeTab === "saved") {
      return savedPosts.length > 0 ? (
        <FlatList
          data={savedPosts}
          keyExtractor={(item) => item._id}
          renderItem={renderPostItem}
          numColumns={3}
          contentContainerStyle={styles.postsContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Chưa có bài đăng đã lưu</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Chưa có bài đăng được gắn thẻ</Text>
        </View>
      );
    }
  };

  if (!profileData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Không tìm thấy dữ liệu người dùng</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Dropdown menu logout */}
      <View style={styles.topRightMenu}>
        <Menu>
          <MenuTrigger>
            <Icon name="ellipsis-v" size={22} color="#333" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={logout} text="Logout" />
          </MenuOptions>
        </Menu>
      </View>

      <View style={styles.header}>
        <Image source={{ uri: profileData.profilePicture || 'https://via.placeholder.com/100' }} style={styles.avatar} />
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{posts.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <TouchableOpacity style={styles.stat} onPress={() => navigation.navigate("FollowersScreen", { userId: currentUserId })}>
            <Text style={styles.statNumber}>{profileData.followers?.length || 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.stat} onPress={() => navigation.navigate("FollowingScreen", { userId: currentUserId })}>
            <Text style={styles.statNumber}>{profileData.following?.length || 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.actionButtonContainer}>
        {currentUserId === userId && (
          <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate("EditProfile")}>
            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.username}>{profileData.username}</Text>
        {profileData.bio ? <Text style={styles.bio}>{profileData.bio}</Text> : null}
        {profileData.website ? <Text style={styles.website}>{profileData.website}</Text> : null}
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab("posts")}>
          <Icon name="th" size={24} color={activeTab === "posts" ? "#e91e63" : "#aaa"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab("saved")}>
          <Icon name="bookmark-o" size={24} color={activeTab === "saved" ? "#e91e63" : "#aaa"} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab("tagged")}>
          <Icon name="user" size={24} color={activeTab === "tagged" ? "#e91e63" : "#aaa"} />
        </TouchableOpacity>
      </View>

      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', padding: 16, alignItems: 'center' },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: '#e91e63' },
  statsContainer: { flex: 1, marginLeft: 16, flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#e91e63' },
  statLabel: { fontSize: 14, color: '#888' },
  actionButtonContainer: { paddingHorizontal: 16, marginBottom: 8, flexDirection: 'row', justifyContent: 'center' },
  editProfileButton: { paddingVertical: 6, paddingHorizontal: 20, borderWidth: 1, borderColor: '#e91e63', borderRadius: 6 },
  editProfileButtonText: { fontWeight: '600', color: '#e91e63' },
  infoContainer: { paddingHorizontal: 16, paddingBottom: 8 },
  username: { fontSize: 18, fontWeight: 'bold', color: '#e91e63' },
  bio: { marginTop: 4, fontSize: 14, color: '#555' },
  website: { marginTop: 4, fontSize: 14, color: '#e91e63', textDecorationLine: 'underline' },
  tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#eee', justifyContent: 'space-around', paddingVertical: 10 },
  tabItem: { alignItems: 'center', justifyContent: 'center' },
  postsContainer: { marginTop: 8 },
  postItem: { width: screenWidth / 3, height: screenWidth / 3 },
  postImage: { width: '100%', height: '100%' },
  placeholderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 16, color: '#aaa' },
  topRightMenu: { position: 'absolute', top: 10, right: 16, zIndex: 999 },
});

export default ProfileScreen;
