import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { editProfile } from '../api/api';

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

      if (res.success) {
        updateUser(res.user); // update context
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
      <Text style={styles.title}>Edit Profile</Text>

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

        <Text style={styles.changePhotoText}>Change Profile Photo</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Bio</Text>
      <TextInput
        style={styles.input}
        value={bio}
        onChangeText={setBio}
        placeholder="Enter your bio"
        multiline
      />

      <Text style={styles.label}>Gender</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
        >
          <Picker.Item label="Select Gender" value="" />
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
  },
  changePhotoText: {
    marginTop: 8,
    color: '#007bff',
  },
  label: {
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  button: {
    backgroundColor: '#0095F6',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default EditProfileScreen;
