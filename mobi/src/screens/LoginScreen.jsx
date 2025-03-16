import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { login as loginAPI } from '../api/api';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu.');
      return;
    }

    try {
      const response = await loginAPI(email, password);
      if (response.data && response.data.success) {
        login(response.data.user);
        Alert.alert('Thành công', 'Đăng nhập thành công!', [
          { text: 'OK', onPress: () => navigation.navigate('HomeTabs') }
        ]);
      } else {
        Alert.alert('Lỗi đăng nhập', response.data.message || 'Sai email hoặc mật khẩu.');
      }
    } catch (error) {
      Alert.alert('Lỗi đăng nhập', error.response?.data?.message || 'Sai email hoặc mật khẩu.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff0f5', // hồng pastel nhẹ nhàng
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ff69b4', // hồng đậm
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ffb6c1', // viền hồng nhẹ
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    width: '100%',
    backgroundColor: '#ff69b4', // màu hồng chính
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 20,
    color: '#ff69b4',
    fontSize: 14,
  },
});

export default LoginScreen;
