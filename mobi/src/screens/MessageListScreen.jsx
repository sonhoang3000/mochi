import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getConversationService } from '../api/api';

const MessagesListScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConversation = async () => {
    try {
      const res = await getConversationService();
      if (res.success) {
        const filteredParticipants = res.conversations.map(conv => {
          const otherUser = conv.participants.find(p => p._id !== user._id);
          return { ...otherUser, conversationId: conv._id };
        });
        setConversations(filteredParticipants);
      }
    } catch (error) {
      console.log('Error fetching conversations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchConversation();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ChatScreen', { conversationId: item.conversationId })
      }
    >
      <View style={styles.chatItem}>
        <Image
          source={
            item?.profilePicture
              ? { uri: item.profilePicture }
              : require('../assets/R.jpg')
          }
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>{item.username || 'Người dùng'}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách trò chuyện</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#FF69B4" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF69B4']} />
          }
          ListEmptyComponent={() => (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào.</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default MessagesListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#D63384',
    textAlign: 'center',
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#FFE4EC',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#FFC0CB',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFB6C1',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#C71585',
  },
  emptyText: {
    color: '#A9A9A9',
    fontSize: 15,
    marginTop: 20,
  },
});
