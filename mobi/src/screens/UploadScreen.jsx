import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addPost } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import { PostContext } from '../context/PostContext';

const UploadScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const { addNewPost } = useContext(PostContext);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Quyền truy cập bị từ chối', 'Bạn cần cấp quyền truy cập thư viện ảnh!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      Alert.alert('Chọn ảnh', 'Vui lòng chọn ảnh trước khi upload');
      return;
    }

    const localUri = image;
    const filename = localUri.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    const fileToUpload = {
      uri: localUri,
      name: filename,
      type,
    };

    try {
      setLoading(true);
      const response = await addPost(fileToUpload, caption);

      const newPost = {
        _id: response._id,
        src: response.imageUrl,
        caption: response.caption,
        user: response.user,
        createdAt: response.createdAt,
        likes: [],
        comments: [],
      };

      addNewPost(newPost); // Cập nhật post context
      Alert.alert('Thành công', 'Bài viết đã được đăng!');
      setImage(null);
      setCaption('');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi upload bài viết:', error);
      Alert.alert('Lỗi', 'Không thể upload ảnh, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tạo Bài Viết Mới</Text>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.selectedImage} />
        ) : (
          <Text style={styles.imagePickerText}>Chọn ảnh</Text>
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.captionInput}
        placeholder="Nhập caption..."
        value={caption}
        onChangeText={setCaption}
        multiline
      />

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={handleUpload}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.uploadButtonText}>Đăng bài</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  imagePicker: {
    width: '100%',
    height: 300,
    backgroundColor: '#eee',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedImage: { width: '100%', height: '100%', borderRadius: 10 },
  imagePickerText: { fontSize: 16, color: '#888' },
  captionInput: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default UploadScreen;
