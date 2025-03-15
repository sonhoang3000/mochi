import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  ActivityIndicator, 
  StyleSheet 
} from 'react-native';
import { getAllCommentsOfPost } from '../api/api';

const AllCommentsScreen = ({ route, navigation }) => {
  const postId = route.params?.postId; 
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) {
      console.error("postId is undefined. Vui lòng truyền đúng postId khi điều hướng.");
      setLoading(false);
      return;
    }
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await getAllCommentsOfPost(postId);
      // Giả sử backend trả về { success: true, comments: [...] }
      setComments(response.data.comments);
    } catch (error) {
      console.error("Lỗi lấy bình luận:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0095f6" />
      </View>
    );
  }

  if (!postId) {
    return (
      <View style={styles.container}>
        <Text>Error: postId is undefined. Vui lòng kiểm tra lại tham số điều hướng.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {comments.length === 0 ? (
        <Text>Chưa có bình luận nào</Text>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Text style={styles.commentText}>
                <Text style={styles.commentUsername}>
                  {item.user?.username}:{" "}
                </Text>
                {item.text}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  commentItem: { 
    marginBottom: 12 
  },
  commentText: { 
    fontSize: 14, 
    color: '#333' 
  },
  commentUsername: { 
    fontWeight: 'bold', 
    color: '#333' 
  },
});

export default AllCommentsScreen;
