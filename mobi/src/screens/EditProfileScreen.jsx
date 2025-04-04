import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { editProfile } from '../api/api';
import { useAuth } from '../context/AuthContext';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updateUser } = useAuth();

  const [bio, setBio] = useState(user?.bio || '');
  const [gender, setGender] = useState(user?.gender || '');
  const [imageUri, setImageUri] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageData({
        uri: asset.uri,
        name: asset.uri.split('/').pop(),
        type: asset.type || 'image/jpeg',
      });
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('bio', bio);
    if (gender) formData.append('gender', gender);
    if (imageData) {
      formData.append('profilePhoto', {
        uri: imageData.uri,
        name: imageData.name,
        type: imageData.type,
      });
    }

    try {
      setLoading(true);
      const res = await editProfile(formData);
<<<<<<< HEAD
      console.log('check')
=======
>>>>>>> 0082e97b985bedc0ff2c23e46d2be1efcc35b6ea

      if (res.success) {
        updateUser(res.user);
        Toast.show({ type: 'success', text1: res.message });
        navigation.navigate('Profile');
      }
    } catch (err) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: err?.response?.data?.message || 'Update failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh sửa hồ sơ</Text>

      <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : user?.profilePicture
                ? { uri: user.profilePicture }
                : null
          }
          style={styles.avatar}
        />
        <Text style={styles.changePhotoText}>Thay đổi ảnh đại diện</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Giới thiệu bản thân</Text>
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Nhập tiểu sử"
        multiline
      />

      <Text style={styles.label}>Giới tính</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Chọn giới tính" value="" />
          <Picker.Item label="Nam" value="male" />
          <Picker.Item label="Nữ" value="female" />
        </Picker>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Lưu thay đổi</Text>
        )}
      </TouchableOpacity>

      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff0f5', // hồng pastel
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#d63384',
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8d7da',
  },
  changePhotoText: {
    marginTop: 8,
    color: '#e83e8c',
    fontWeight: '600',
  },
  label: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#c2185b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#f8bbd0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    minHeight: 60,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#f8bbd0',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ec407a',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default EditProfileScreen;
