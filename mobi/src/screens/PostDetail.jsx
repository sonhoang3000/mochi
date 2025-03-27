import React, { useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { likePost, dislikePost, bookmarkPost, addComment } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const PostDetail = ({ route }) => {
  const { post } = route.params;
  const { userId, user } = useContext(AuthContext);
  const [currentPost, setCurrentPost] = useState(post);
  const navigation = useNavigation();
  const [commentText, setCommentText] = useState('');

  const isLiked = currentPost.likes?.includes(userId);
  const isBookmarked = currentPost.bookmarks?.includes(userId);

  const handleAddComment = async () => {
    if (!commentText.trim()) return; 
    try {
      const response = await addComment(currentPost._id, commentText);
      
      setCurrentPost(prev => ({
        ...prev,
        comments: [
          ...prev.comments,
          {
            _id: response.data.comment._id,
            text: commentText,
            createdAt: new Date().toISOString(),
            author: {
              _id: userId,
              username: user.username,
              profilePicture: user.profilePicture
            }
          }
        ]
      }));
        setCommentText('');
      Toast.show({  type: 'success',  text1: 'Bình luận thành công',});
    } catch (error) {
      console.error('Lỗi khi thêm bình luận:', error);
      Toast.show({  type: 'error',  text1: 'Không thể thêm bình luận'});
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await dislikePost(currentPost._id);
        setCurrentPost(prev => ({
          ...prev,
          likes: prev.likes.filter(id => id !== userId)
        }));
        Toast.show({ type: 'success', text1: 'Đã bỏ thích bài viết' });
      } else {
        await likePost(currentPost._id);
        setCurrentPost(prev => ({
          ...prev,
          likes: [...(prev.likes || []), userId]
        }));
        Toast.show({ type: 'success', text1: 'Đã thích bài viết' });
      }
    } catch (error) {
      console.error('Lỗi khi thích bài viết:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      const res = await bookmarkPost(currentPost._id);
      setCurrentPost(prev => ({
        ...prev,
        bookmarks: isBookmarked
          ? prev.bookmarks.filter(id => id !== userId)
          : [...(prev.bookmarks || []), userId]
      }));
      Toast.show({ type: 'success', text1: res.data.message });
    } catch (error) {
      console.error('Lỗi khi bookmark:', error);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffTime = Math.abs(now - commentDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
    if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`;
    } else {
      return 'now';
    }
  };
  

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Khám phá</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.mainContent}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.userInfo}>
          <Image
            source={{ uri: currentPost.author?.profilePicture || 'https://via.placeholder.com/50' }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{currentPost.author?.username}</Text>
        </View>

        <Image source={{ uri: currentPost.src }} style={styles.image} />

        <View style={styles.actionsContainer}>
          <View style={styles.leftActions}>
            <TouchableOpacity style={styles.actionItem} onPress={handleLike}>
              <Ionicons 
                name={isLiked ? 'heart' : 'heart-sharp'} 
                size={26} 
                style={[styles.icon, isLiked && styles.liked]} 
              />
              <Text style={styles.actionText}>{currentPost.likes?.length || 0}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="chatbubble-outline" size={26} style={styles.icon} />
              <Text style={styles.actionText}>{currentPost.comments?.length || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="paper-plane-outline" size={26} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleBookmark}>
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={26}
              style={[styles.icon, isBookmarked && styles.bookmarked]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.commentsSection}>
          {currentPost.comments && currentPost.comments.length > 0 ? (
            currentPost.comments.map((comment, index) => (
              <View key={comment._id || index} style={styles.commentItem}>
                <Image 
                  source={{ uri: comment.author?.profilePicture || 'https://res.cloudinary.com/dybo8zd4y/image/upload/v1742839962/lyed4grcpvdk0pndgzzt.jpg' }} 
                  style={styles.commentAvatar} 
                />
                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUsername}>{comment.author?.username}: </Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                  <Text style={styles.timeText}>{formatTime(comment.createdAt)}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noComments}>Chưa có bình luận nào</Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.inputSection}>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập bình luận..."
          placeholderTextColor="#999"
          multiline={false}
          value={commentText}
          onChangeText={setCommentText}
        />
        <TouchableOpacity 
          style={styles.sendButton}
          onPress={handleAddComment}
        >
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, },
  title: { fontSize: 20, fontWeight: 'bold', color: 'white', },
  placeholder: { width: 40, },
  image: { width: '100%', height: 400, resizeMode: 'cover', },
  userInfo: { flexDirection: 'row', alignItems: 'center', },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10, },
  username: { fontWeight: 'bold', fontSize: 16, color: '#fff', },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, },
  leftActions: { flexDirection: 'row', alignItems: 'center', },
  actionItem: { flexDirection: 'row', alignItems: 'center', marginRight: 10, },
  icon: { color: 'white', },
  liked: { color: 'red', },
  bookmarked: { color: 'orange', },
  actionText: { color: '#fff', fontSize: 14, },
  caption: { color: '#fff', },
  // Comment
  commentsSection: {  padding: 5,  flex: 1, },
  commentItem: {  flexDirection: 'row',  marginBottom: 15,  alignItems: 'center', },
  commentAvatar: {  width: 30,  height: 30,  borderRadius: 15,  marginRight: 10, },
  commentContent: { flexDirection: 'row', flex: 1,  backgroundColor: '#1a1a1a', borderRadius: 15,  padding: 10, alignItems: 'center'},
  commentHeader: { flexDirection: 'row', alignItems: 'center', flex: 1,},
  commentUsername: {  color: '#fff',  fontWeight: 'bold',  marginBottom: 2, },
  commentText: {  color: '#fff',  fontSize: 14, },
  timeText: { color: '#999', fontSize: 16,},
  noComments: {  color: '#999',  textAlign: 'center',  marginTop: 20,  fontSize: 16, },
  // Text Input
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainContent: { flex: 1, },
  scrollContent: {
    flexGrow: 1,
  },
  inputSection: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#333',
    backgroundColor: '#000',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    color: '#fff',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    marginLeft: 10,
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default PostDetail; 