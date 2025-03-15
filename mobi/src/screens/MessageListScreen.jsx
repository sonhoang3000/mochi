import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getAllMessages } from '../api/api';

const MessagesListScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?._id) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await getAllMessages(user._id);
          console.log('Dữ liệu từ API:', data); // 👉 in ra kiểm tra

      const messages = data?.messages || [];

      const lastMessagesMap = new Map();

      messages.forEach((msg) => {
        const otherUser =
          msg.senderId._id === user._id ? msg.receiverId : msg.senderId;
        const key = otherUser._id;

        const existing = lastMessagesMap.get(key);
        if (!existing || new Date(msg.createdAt) > new Date(existing.lastMessage.createdAt)) {
          lastMessagesMap.set(key, {
            user: otherUser,
            lastMessage: {
              text: msg.message,
              createdAt: msg.createdAt,
              chatId: msg.chatId || null,
            },
          });
        }
      });

      const result = Array.from(lastMessagesMap.values());
      setConversations(result);
    } catch (err) {
      console.error('❌ Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMessages();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const { user: otherUser, lastMessage } = item;
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() =>
          navigation.navigate('ChatScreen', {
            chatId: lastMessage.chatId,
            receiver: otherUser,
          })
        }
      >
        <Text style={styles.username}>{otherUser?.username || 'Người dùng'}</Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {lastMessage?.text || 'Chưa có tin nhắn nào'}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Danh sách trò chuyện</Text>

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.user._id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={conversations.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào.</Text>
        }
      />
    </View>
  );
};

export default MessagesListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  chatItem: {
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  lastMessage: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
