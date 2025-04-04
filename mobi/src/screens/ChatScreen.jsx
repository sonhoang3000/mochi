import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
<<<<<<< HEAD
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import {
  getAllMessages,
  sendMessage,
} from '../api/api'; // Gọi API getMessagesInChat, sendMessage
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = ({ route }) => {
  const { chatId, receiver } = route.params;
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const flatListRef = useRef();

  useEffect(() => {
    fetchChatMessages();
  }, [chatId]);

  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      const res = await getAllMessages(chatId);
      setMessages(res?.messages || []);
    } catch (err) {
      console.log('Lỗi lấy tin nhắn:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await sendMessage(chatId, {
        message: newMessage,
        receiverId: receiver._id,
      });
      if (res?.message) {
        setMessages((prev) => [...prev, res.message]);
        setNewMessage('');
        scrollToEnd();
      }
    } catch (err) {
      console.log('Lỗi gửi tin nhắn:', err);
    }
  };

=======
  Image,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { getAllMessages, sendMessage } from '../api/api';
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = ({ route, navigation }) => {
  const { receiver } = route.params;
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (receiver?._id) {
      fetchMessages();
    }
  }, [receiver?._id]);

  const fetchMessages = async () => {
    try {
      const res = await getAllMessages(receiver?._id);
      if (res.success) {
        setMessages(res.messages || []);
        scrollToEnd();
      }
    } catch (error) {
      console.log('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (isSending || !textMessage.trim()) return;

    try {
      setIsSending(true);
      const res = await sendMessage(receiver?._id, { textMessage: textMessage.trim() });
      
      if (res?.data?.success) {
        const newMessage = res.data.newMessage;
        setMessages(prev => [...prev, newMessage]);
        setTextMessage('');
        scrollToEnd();
      }
    } catch (error) {
      console.log('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    if (socket && receiver?._id) {
      socket.on('newMessage', (newMessage) => {
        if (newMessage.senderId === receiver._id || newMessage.receiverId === receiver._id) {
          setMessages(prev => [...prev, newMessage]);
          scrollToEnd();
        }
      });

      return () => {
        socket.off('newMessage');
      };
    }
  }, [socket, receiver?._id]);

>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

<<<<<<< HEAD
  const renderItem = ({ item }) => {
    const isOwnMessage = item.senderId === user._id;
    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
=======
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerContent}>
          <Image
            source={
              receiver?.profilePicture
                ? { uri: receiver.profilePicture }
                : require('../assets/default-avatar.jpg')
            }
            style={styles.headerAvatar}
          />
          <Text style={styles.headerUsername}>{receiver?.username}</Text>
        </View>
      ),
    });
  }, [receiver]);

  const renderMessage = ({ item }) => {
    const isOwnMessage = item.senderId === user?._id;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        <Text style={[
          styles.messageText,
          isOwnMessage ? styles.ownMessageText : styles.otherMessageText
        ]}>
          {item.message}
        </Text>
        {item.createdAt && (
          <Text style={styles.messageTime}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        )}
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
<<<<<<< HEAD
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{receiver?.username}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={scrollToEnd}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
=======
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={90}
    >
      <View style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <Image
            source={
              receiver?.profilePicture
                ? { uri: receiver.profilePicture }
                : require('../assets/R.jpg')
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{receiver?.username}</Text>
        </View>

        <View style={styles.messagesContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id || Math.random().toString()}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={scrollToEnd}
            inverted={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tin nhắn..."
            value={textMessage}
            onChangeText={setTextMessage}
            multiline
            maxHeight={100}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!textMessage.trim() || isSending) && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!textMessage.trim() || isSending}
          >
            <Ionicons 
              name="send" 
              size={24} 
              color={textMessage.trim() && !isSending ? '#fff' : '#A0A0A0'} 
            />
          </TouchableOpacity>
        </View>
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
      </View>
    </KeyboardAvoidingView>
  );
};

<<<<<<< HEAD
export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  messagesList: {
    padding: 10,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '70%',
    padding: 10,
    marginVertical: 6,
    borderRadius: 10,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
=======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  contentContainer: {
    flex: 1,
  },
  profileContainer: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E4E6EB',
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#FFF0F5',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '75%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 20,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E4E6EB',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  messageTime: {
    fontSize: 11,
    color: '#A0A0A0',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E6EB',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
    maxHeight: 100,
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 25,
<<<<<<< HEAD
    padding: 12,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
=======
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#F0F2F5',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});

export default ChatScreen;
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea
