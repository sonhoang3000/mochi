import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { PostProvider } from './src/context/PostContext';
import Toast from 'react-native-toast-message';

const App = () => {
  
  return (
    
    <AuthProvider>
      <PostProvider>
        <AppNavigator />
        <Toast />
      </PostProvider>
    </AuthProvider>
  );
};

export default App;
