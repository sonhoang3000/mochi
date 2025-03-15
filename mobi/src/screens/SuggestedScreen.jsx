import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { getSuggestedUsers, followOrUnfollow } from '../api/api';
import { AuthContext } from '../context/AuthContext';

const SuggestedUsersScreen = () => {
  const { user, setUser } = useContext(AuthContext);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSuggested();
  }, []);

  const fetchSuggested = async () => {
    try {
      const users = await getSuggestedUsers();
      const usersWithFollowState = users.map(userItem => ({
        ...userItem,
        isFollowing: user?.following?.includes(userItem._id),
      }));
      setSuggestedUsers(usersWithFollowState);
      setFilteredUsers(usersWithFollowState);
    } catch (error) {
      console.error('Error fetching suggested users:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSuggested();
    setRefreshing(false);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = suggestedUsers.filter((userItem) =>
      userItem.username.toLowerCase().includes(text.toLowerCase()) ||
      userItem.email.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleFollowUnfollow = async (targetUserId) => {
    try {
      const response = await followOrUnfollow(targetUserId, user._id);

      if (response.success) {
        const updatedSuggested = suggestedUsers.map(item =>
          item._id === targetUserId
            ? { ...item, isFollowing: !item.isFollowing }
            : item
        );
        const updatedFiltered = filteredUsers.map(item =>
          item._id === targetUserId
            ? { ...item, isFollowing: !item.isFollowing }
            : item
        );

        setSuggestedUsers(updatedSuggested);  
        setFilteredUsers(updatedFiltered);    

        const isNowFollowing = !user.following.includes(targetUserId);
        const updatedFollowing = isNowFollowing
          ? [...user.following, targetUserId]
          : user.following.filter(id => id !== targetUserId);

        setUser({ ...user, following: updatedFollowing });
      }
    } catch (error) {
      console.error('Follow/Unfollow Error:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={
          item.profilePicture
            ? { uri: item.profilePicture }
            : require('../assets/R.jpg')
        }
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity
        style={[styles.followButton, item.isFollowing ? styles.unfollowBtn : styles.followBtn]}
        onPress={() => handleFollowUnfollow(item._id)} 
      >
        <Text style={item.isFollowing ? styles.unfollowText : styles.followText}>
          {item.isFollowing ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suggested Users</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by username or email..."
        value={searchQuery}
        onChangeText={handleSearch}
        placeholderTextColor="#999"
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No users found.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#333',
  },
  searchInput: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  followButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  followBtn: {
    backgroundColor: '#007AFF',
  },
  unfollowBtn: {
    backgroundColor: '#E0E0E0',
  },
  followText: {
    color: '#fff',
    fontWeight: '600',
  },
  unfollowText: {
    color: '#333',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 16,
    color: '#999',
  },
});

export default SuggestedUsersScreen;
