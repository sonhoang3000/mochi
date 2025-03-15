import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { getMessages, sendMessage, listenForMessages } from '../api/api'; 
import { useAuth } from '../context/AuthContext';

const MessagesScreen = ({ route }) => {
  const { userId } = useAuth();
  const { receiverId } = route.params;
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    fetchMessages();

    listenForMessages((newMsg) => {
      if ((newMsg.senderId === receiverId || newMsg.receiverId === receiverId)) {
        setMessages((prev) => [...prev, newMsg]);
        scrollToEnd();
      }
    });

    return () => {
    
    };
  }, []);

  const fetchMessages = async () => {
    const data = await getMessages(userId, receiverId);
    setMessages(data.messages);
    scrollToEnd();
  };

  const handleSend = async () => {
    if (messageText.trim()) {
      const newMsg = await sendMessage(userId, receiverId, messageText);
      setMessages((prev) => [...prev, newMsg]);
      setMessageText('');
      scrollToEnd();
    }
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, padding: 10 }} behavior="padding">
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{
            alignSelf: item.senderId === userId ? 'flex-end' : 'flex-start',
            backgroundColor: item.senderId === userId ? '#007bff' : '#ccc',
            borderRadius: 10,
            marginVertical: 4,
            padding: 8,
            maxWidth: '75%',
          }}>
            <Text style={{ color: item.senderId === userId ? '#fff' : '#000' }}>{item.message}</Text>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Nhắn tin..."
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginRight: 5 }}
        />
        <TouchableOpacity onPress={handleSend} style={{ padding: 10, backgroundColor: '#007bff', borderRadius: 8 }}>
          <Text style={{ color: '#fff' }}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MessagesScreen;
