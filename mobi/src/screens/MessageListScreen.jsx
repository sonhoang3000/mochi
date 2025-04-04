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
<<<<<<< HEAD

const MessagesListScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
=======
import { Ionicons } from '@expo/vector-icons';
import { SocketContext } from '../context/SocketContext';
const MessagesListScreen = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { socket, onlineUsers } = useContext(SocketContext);
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea

  const fetchConversation = async () => {
    try {
      const res = await getConversationService();
      if (res.success) {
<<<<<<< HEAD
        const filteredParticipants = res.conversations.map(conv => {
          const otherUser = conv.participants.find(p => p._id !== user._id);
          return { ...otherUser, conversationId: conv._id };
        });
        setConversations(filteredParticipants);
=======
        const sortedConversations = res.conversations.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setConversations(sortedConversations);
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
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
<<<<<<< HEAD
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
=======

    if (socket) {
      socket.on('receiveMessage', (message) => {
        setConversations(prev => {
          const updated = prev.map(conv => {
            if (conv._id === message.conversationId) {
              return {
                ...conv,
                lastMessage: message.message,
                updatedAt: new Date().toISOString()
              };
            }
            return conv;
          });
          return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });
      });

      socket.on('newMessage', (message) => {
        setConversations(prev => {
          const updated = prev.map(conv => {
            if (conv._id === message.conversationId) {
              return {
                ...conv,
                lastMessage: message.message,
                updatedAt: new Date().toISOString()
              };
            }
            return conv;
   

       });
          return updated.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        });
      });
    }

    const unsubscribe = navigation.addListener('focus', fetchConversation);
    return () => {
      unsubscribe();
      if (socket) {
        socket.off('newMessage');
        socket.off('receiveMessage');
      }
    };
  }, [navigation, socket]);

  const renderItem = ({ item }) => {

    const otherUser = item.participants?.find(p => p._id !== user._id);
    const isOnline = onlineUsers?.includes(otherUser?._id);

    console.log("otherUser", otherUser?._id);
    console.log("onlineUsers", onlineUsers);
    console.log("isOnline", isOnline);

    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => {
          navigation.navigate('ChatScreen', {
            chatId: item._id,
            receiver: otherUser
          });
        }}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={
              otherUser?.profilePicture
                ? { uri: otherUser.profilePicture }
                : require('../assets/R.jpg')
            }
            style={styles.avatar}
          />
          {isOnline && <View style={styles.onlineIndicator} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.headerRow}>
            <Text style={styles.username}>{otherUser?.username || 'Người dùng'}</Text>
            <Text style={styles.time}>
              {formatTime(item.updatedAt)}
            </Text>
          </View>

          <View style={styles.messageRow}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage || 'Bắt đầu cuộc trò chuyện'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
<<<<<<< HEAD
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#FF69B4']} />
          }
          ListEmptyComponent={() => (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào.</Text>
=======
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={fetchConversation}
              colors={['#007AFF']} 
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="chatbubbles-outline" size={64} color="#999" />
              <Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào</Text>
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
            </View>
          )}
        />
      )}
    </View>
  );
};

<<<<<<< HEAD
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
=======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
<<<<<<< HEAD
    color: '#C71585',
  },
  emptyText: {
    color: '#A9A9A9',
    fontSize: 15,
    marginTop: 20,
  },
});
=======
    color: '#000',
  },
  time: {
    fontSize: 12,
    color: '#666',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessagesListScreen;
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
